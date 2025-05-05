package org.atlas.services;

import org.atlas.dtos.SpaceDto;
import org.atlas.dtos.TeamMembersDto;
import org.atlas.dtos.TeamsDto;
import org.atlas.entities.Team;
import org.atlas.entities.TeamInvites;
import org.atlas.entities.TeamMembers;
import org.atlas.enums.InviteStatus;
import org.atlas.enums.RoutingKeys;
import org.atlas.enums.TeamRole;
import org.atlas.exceptions.Exception;
import org.atlas.exceptions.ExceptionHandler;
import org.atlas.interfaces.OrganizationPublishServiceInterface;
import org.atlas.interfaces.SpaceServiceInterface;
import org.atlas.interfaces.TeamServiceInterface;

import org.atlas.repositories.*;
import org.atlas.requests.SpaceRequest;
import org.atlas.requests.TeamInviteRequest;
import org.atlas.requests.TeamRequest;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.*;


import static org.atlas.exceptions.Exceptions.EXCEPTION_01;
import static org.atlas.exceptions.Exceptions.EXCEPTION_02;

@Service
public class TeamService implements TeamServiceInterface {

    final TeamRepository teamRepository;
    final TeamMembersRepository teamMembersRepository;
    final OrganizationRepository organizationRepository;
    final TeamInvitesRepository teamInvitesRepository;
    final OrganizationPublishServiceInterface publishService;
    private final ModelMapper modelMapper;
    private final SpaceServiceInterface spaceService;
    final Logger logger =
            LoggerFactory.getLogger(TeamService.class);
    private final OrganizationPublishService organizationPublishService;

    @Autowired
    public TeamService(TeamRepository teamRepository, TeamMembersRepository teamMembersRepository, OrganizationRepository organizationRepository, TeamInvitesRepository teamInvitesRepository, OrganizationPublishService publishService, ModelMapper modelMapper, SpaceService spaceService, OrganizationPublishService organizationPublishService) {
        this.teamRepository = teamRepository;
        this.teamMembersRepository = teamMembersRepository;
        this.organizationRepository = organizationRepository;
        this.teamInvitesRepository = teamInvitesRepository;
        this.publishService = publishService;
        this.modelMapper = modelMapper;
        this.spaceService = spaceService;
        this.organizationPublishService = organizationPublishService;
    }


    @Override
    public Mono<Team> saveTeam(TeamRequest team) {
        logger.info("Initiating save operation for team: {}", team.name());

        Team newTeam = Team.builder()
                .name(team.name())
                .organizationId(team.organizationId())
                .build();

        return teamRepository.save(newTeam)
                .flatMap(savedTeam -> {
                    logger.debug("Team saved with ID: {}. Fetching organization details.", savedTeam.getTeam_id());

                    return organizationRepository.findById(savedTeam.getOrganizationId())
                            .switchIfEmpty( Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_02))))
                            .flatMap(organization -> {
                                logger.debug("Creating team member with owner role for user: {}", organization.getOwnerId());

                                TeamMembers member = TeamMembers.builder()
                                        .teamId(savedTeam.getTeam_id())
                                        .role(TeamRole.OWNER)
                                        .userId(organization.getOwnerId())
                                        .build();

                                return teamMembersRepository.save(member)
                                        .flatMap(savedMember -> {
                                            logger.debug("Team member created with ID: {}", savedMember.getId());


                                            SpaceRequest defaultSpace = new SpaceRequest(
                                                    savedTeam.getName() + "'s default space",
                                                    "Team's default space",
                                                    "default icon",
                                                    savedTeam.getTeam_id(),
                                                    null);

                                            logger.debug("Creating default space for team: {}", savedTeam.getTeam_id());

                                            return spaceService.createSpace(defaultSpace)
                                                    .thenReturn(savedTeam);
                                        });
                            });
                })
                .doOnSuccess(savedTeam ->
                        logger.info("Successfully saved team with ID: {} and created default space", savedTeam.getTeam_id()))
                .doOnError(error ->
                        logger.error("Error occurred during team creation process: {}", error.getMessage()));
    }

    @Override
    public Mono<String> inviteToTeam(TeamInviteRequest teamInviteRequest) {
        logger.info("Processing team invite request for team ID: {}", teamInviteRequest.teamId());

        return teamRepository.findById(teamInviteRequest.teamId())
                .flatMap(team -> {
                    if (team == null) {
                        logger.error("Team not found with ID: {}", teamInviteRequest.teamId());
                        return  Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_01)));
                    }

                    logger.info("Found team: {}", team.getName());
                    return organizationRepository.findById(team.getOrganizationId())
                            .flatMap(organization -> {
                                logger.info("Found organization: {}", organization.getName());

                                return teamInvitesRepository.save(
                                        TeamInvites.builder()
                                                .created(LocalDateTime.now())
                                                .email(teamInviteRequest.email())
                                                .expires(LocalDateTime.now().plusDays(3))
                                                .status(InviteStatus.PENDING)
                                                .teamId(team.getTeam_id())
                                                .build()
                                ).flatMap(savedInvite -> {
                                    HashMap<String, Object> map = new HashMap<>();
                                    map.put("messageType", "TEAM_INVITE");
                                    map.put("email", teamInviteRequest.email());
                                    map.put("team_name", team.getName());
                                    map.put("organization_name", organization.getName());
                                    map.put("invite_id", savedInvite.getInviteId());

                                    logger.info("Publishing team invite message for team: {}, organization: {}",
                                            team.getName(), organization.getName());

                                    organizationPublishService.publishMessage("data-exchange",
                                            RoutingKeys.TEAM_INVITE.getValue(), map);

                                    return Mono.just("Invite sent to " + teamInviteRequest.email());
                                });
                            });
                });
    }

    @Override
    public Flux<TeamsDto> getOrgTeams(UUID orgId) {
        return teamRepository.findAllByOrganizationId(orgId)
                .flatMap(team -> {
                    Mono<List<SpaceDto>> spacesMono = spaceService.getSpaces(team.getTeam_id()).collectList();

                    Mono<List<TeamMembersDto>> membersMono = teamMembersRepository.findAllByTeamId(team.getTeam_id())
                            .map(member -> modelMapper.map(member, TeamMembersDto.class))
                            .collectList();

                    return Mono.zip(spacesMono, membersMono)
                            .map(tuple -> new TeamsDto(
                                    team.getTeam_id(),
                                    team.getName(),
                                    tuple.getT1(),
                                    tuple.getT2()
                            ));
                });
    }


}
