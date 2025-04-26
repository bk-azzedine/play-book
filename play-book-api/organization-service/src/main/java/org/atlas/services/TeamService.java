package org.atlas.services;

import org.atlas.entities.Team;
import org.atlas.entities.TeamInvites;
import org.atlas.entities.TeamMembers;
import org.atlas.enums.InviteStatus;
import org.atlas.enums.RoutingKeys;
import org.atlas.enums.TeamRole;
import org.atlas.exceptions.Exception;
import org.atlas.exceptions.ExceptionHandler;
import org.atlas.interfaces.OrganizationPublishServiceInterface;
import org.atlas.interfaces.TeamServiceInterface;

import org.atlas.repositories.OrganizationRepository;
import org.atlas.repositories.TeamInvitesRepository;
import org.atlas.repositories.TeamMembersRepository;
import org.atlas.repositories.TeamRepository;
import org.atlas.requests.TeamInviteRequest;
import org.atlas.requests.TeamRequest;
import org.atlas.enums.InviteStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.HashMap;

import static org.atlas.exceptions.Exceptions.EXCEPTION_01;

@Service
public class TeamService implements TeamServiceInterface {

    final TeamRepository teamRepository;
    final TeamMembersRepository teamMembersRepository;
    final OrganizationRepository organizationRepository;
    final TeamInvitesRepository teamInvitesRepository;
    final OrganizationPublishServiceInterface publishService;
    final Logger logger =
            LoggerFactory.getLogger(TeamService.class);
    private final OrganizationPublishService organizationPublishService;

    @Autowired
    public TeamService(TeamRepository teamRepository, TeamMembersRepository teamMembersRepository, OrganizationRepository organizationRepository, TeamInvitesRepository teamInvitesRepository, OrganizationPublishService publishService, OrganizationPublishService organizationPublishService) {
        this.teamRepository = teamRepository;
        this.teamMembersRepository = teamMembersRepository;
        this.organizationRepository = organizationRepository;
        this.teamInvitesRepository = teamInvitesRepository;
        this.publishService = publishService;
        this.organizationPublishService = organizationPublishService;
    }

    @Override
    public Mono<Team> saveTeam(TeamRequest team) {
        logger.info("Initiating save operation for team: {}", team.name());

        Team newTeam = Team.builder()
                .name(team.name())
                .organization_id(team.organizationId())
                .build();

        return teamRepository.save(newTeam)
                .flatMap(savedTeam ->
                        organizationRepository.findById(savedTeam.getOrganization_id())
                                .flatMap(organization -> {
                                    TeamMembers member = TeamMembers.builder()
                                            .teamId(savedTeam.getTeam_id())
                                            .role(TeamRole.OWNER)
                                            .userId(organization.getOwnerId())
                                            .build();
                                    return teamMembersRepository.save(member)
                                            .thenReturn(savedTeam);
                                })
                )
                .doOnSuccess(savedTeam ->
                        logger.info("Successfully saved team with ID: {}", savedTeam.getTeam_id()))
                .doOnError(error ->
                        logger.error("Error occurred while saving team", error));
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
                    return organizationRepository.findById(team.getOrganization_id())
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

}
