package org.atlas.services;

import org.atlas.dtos.SpaceDto;
import org.atlas.dtos.TeamMembersDto;
import org.atlas.dtos.TeamsDto;
import org.atlas.dtos.UserDto;
import org.atlas.entities.Team;
import org.atlas.entities.TeamInvites;
import org.atlas.entities.TeamMembers;
import org.atlas.enums.*;
import org.atlas.exceptions.Exception;
import org.atlas.exceptions.ExceptionHandler;
import org.atlas.interfaces.OrganizationPublishServiceInterface;
import org.atlas.interfaces.SpaceServiceInterface;
import org.atlas.interfaces.TeamServiceInterface;

import org.atlas.interfaces.UserServiceInterface;
import org.atlas.repositories.*;
import org.atlas.requests.*;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeoutException;

import static org.atlas.exceptions.Exceptions.*;

@Service
public class TeamService implements TeamServiceInterface {

    final TeamRepository teamRepository;
    final TeamMembersRepository teamMembersRepository;
    final OrganizationRepository organizationRepository;
    final TeamInvitesRepository teamInvitesRepository;
    final UserServiceInterface userService;
    final OrganizationPublishServiceInterface publishService;
    private final ModelMapper modelMapper;
    private final SpaceServiceInterface spaceService;
    final Logger logger =
            LoggerFactory.getLogger(TeamService.class);
    private final OrganizationPublishService organizationPublishService;

    @Autowired
    public TeamService(TeamRepository teamRepository, TeamMembersRepository teamMembersRepository, OrganizationRepository organizationRepository, TeamInvitesRepository teamInvitesRepository, UserService userService, OrganizationPublishService publishService, ModelMapper modelMapper, SpaceService spaceService, OrganizationPublishService organizationPublishService) {
        this.teamRepository = teamRepository;
        this.teamMembersRepository = teamMembersRepository;
        this.organizationRepository = organizationRepository;
        this.teamInvitesRepository = teamInvitesRepository;
        this.userService = userService;
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
                .organizationId(team.companyId())
                .description(team.description())
                .build();

        return teamRepository.save(newTeam)
                .flatMap(savedTeam -> {
                    logger.debug("Team saved with ID: {}. Fetching organization details.", savedTeam.getTeam_id());

                    return organizationRepository.findById(savedTeam.getOrganizationId())
                            .switchIfEmpty(Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_02))))
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
                                                    "heroComputerDesktop",
                                                    savedTeam.getTeam_id(),
                                                    SpaceVisibility.PUBLIC,
                                                    Collections.singletonList(new SpaceMemberRequest(new MemberRequest(organization.getOwnerId(), null, null, null), SpacePrivileges.CAN_EDIT)));

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
                        return Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_01)));
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
                                                .role(TeamRole.valueOf(teamInviteRequest.role()))
                                                .build()
                                ).flatMap(savedInvite -> {

                                    HashMap<String, Object> map = new HashMap<>();
                                    map.put("messageType", "TEAM_INVITE");
                                    map.put("email", teamInviteRequest.email());
                                    map.put("team_name", team.getName());
                                    map.put("team_description", team.getDescription());
                                    map.put("organization_name", organization.getName());
                                    map.put("invite_id", savedInvite.getInviteId());
                                    map.put("team_role", teamInviteRequest.role());

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
    public Mono<List<String>> inviteMultipleToTeam(MultipleTeamInviteRequest team) { // Changed return type
        logger.info("Processing multiple team invite requests for team ID: {}", team.teamId());

        List<TeamInviteRequest> teamInviteRequests = team.emails().stream()
                .map(email -> new TeamInviteRequest(email, team.teamId(), team.role()))
                .toList();

        // Use Flux.fromIterable and flatMap to process each invite and collect results
        return Flux.fromIterable(teamInviteRequests)
                .flatMap(this::inviteToTeam) // Call inviteToTeam for each request
                .collectList(); // Collect all successful messages into a List
    }

    @Override
    public Mono<String> DeclineInvite(UUID inviteId) {
        logger.info("Attempting to decline invite with ID: {}", inviteId);

        return teamInvitesRepository.findById(inviteId)
                .switchIfEmpty(Mono.defer(() -> {
                    logger.warn("Invite with ID: {} not found. Cannot decline.", inviteId);
                    return Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_04)));
                }))
                .flatMap(teamInvite -> {
                    logger.debug("Found invite with ID: {}. Current status: {}", teamInvite.getInviteId(), teamInvite.getStatus());
                    teamInvite.setStatus(InviteStatus.REJECTED);
                    logger.info("Setting invite ID: {} status to REJECTED.", teamInvite.getInviteId());
                    return teamInvitesRepository.save(teamInvite)
                            .doOnSuccess(savedInvite -> logger.info("Successfully declined invite with ID: {}", savedInvite.getInviteId()))
                            .doOnError(e -> logger.error("Failed to save declined invite with ID: {}. Error: {}", teamInvite.getInviteId(), e.getMessage(), e))
                            .thenReturn("Invite declined successfully"); // Change .then() to .thenReturn()
                })
                .doOnSuccess(message -> logger.info("Decline invite process completed for ID: {}. Result: {}", inviteId, message))
                .doOnError(e -> logger.error("Decline invite process failed for ID: {}. Overall error: {}", inviteId, e.getMessage(), e));
    }


        @Override
        public Flux<TeamsDto> getOrgTeams (UUID orgId){
            logger.info("Getting teams for organization with ID: {}", orgId);
            return teamRepository.findAllByOrganizationId(orgId)
                    .doOnNext(team -> logger.info("Found team: ID={}, Name={}", team.getTeam_id(), team.getName()))
                    .flatMap(team -> {
                        logger.info("Processing team: {}", team.getName());

                        // Get all spaces for this team
                        Mono<List<SpaceDto>> spacesMono = spaceService.getSpaces(team.getTeam_id())
                                .doOnNext(space -> logger.info("Found space for team {}: {}", team.getName(), space))
                                .collectList()
                                .doOnNext(spaces -> logger.info("Team {} has {} spaces", team.getName(), spaces.size()));

                        // Get all team members
                        Mono<List<TeamMembersDto>> membersMono = teamMembersRepository.findAllByTeamId(team.getTeam_id())
                                .doOnNext(member -> logger.info("Found team member for team {}: UserID={}", team.getName(), member.getUserId()))
                                .map(member -> {
                                    TeamMembersDto memberDto = modelMapper.map(member, TeamMembersDto.class);
                                    UserDto userDto = new UserDto();
                                    userDto.setUserId(member.getUserId());
                                    memberDto.setUser(userDto);
                                    return memberDto;
                                })
                                .collectList()
                                .doOnNext(members -> logger.info("Team {} has {} members", team.getName(), members.size()));

                        // Get user IDs from team members
                        Mono<List<UUID>> userIdsMono = teamMembersRepository.findAllByTeamId(team.getTeam_id())
                                .map(TeamMembers::getUserId)
                                .collectList()
                                .doOnNext(userIds -> logger.info("Team {} has {} user IDs", team.getName(), userIds.size()));

                        // Combine all operations
                        return Mono.zip(spacesMono, membersMono, userIdsMono)
                                .doOnNext(tuple -> {
                                    List<SpaceDto> spaces = tuple.getT1();
                                    List<TeamMembersDto> members = tuple.getT2();
                                    List<UUID> userIds = tuple.getT3();
                                    logger.info("Zip result for team {}: spaces={}, members={}, userIds={}",
                                            team.getName(), spaces.size(), members.size(), userIds.size());
                                })
                                .flatMap(tuple -> {
                                    List<SpaceDto> spaces = tuple.getT1();
                                    List<TeamMembersDto> members = tuple.getT2();
                                    List<UUID> userIds = tuple.getT3();

                                    // If there are no members, return the team directly
                                    if (userIds.isEmpty()) {
                                        logger.info("Team {} has no members, returning early", team.getName());
                                        return Mono.just(new TeamsDto(
                                                team.getTeam_id(),
                                                team.getName(),
                                                team.getDescription(),
                                                spaces,
                                                members
                                        ));
                                    }// Fetch all user details at once
                                    return userService.getOrgMembers(userIds)
                                            .doOnNext(user -> logger.info("Received user details: ID={}, Name={}", user.getUserId(), user.getFirstName()))
                                            .collectMap(UserDto::getUserId)
                                            .doOnNext(userMap -> logger.info("Collected {} users from user service", userMap.size()))
                                            .map(userMap -> {
                                                // Populate user details in team members
                                                members.forEach(member -> {
                                                    UUID userId = member.getUser().getUserId();
                                                    logger.info("Looking up user with ID: {} in user map", userId);
                                                    if (userMap.containsKey(userId)) {
                                                        member.setUser(userMap.get(userId));
                                                        logger.info("Populated user {} in team member", userId);
                                                    } else {
                                                        logger.warn("User {} not found in user map", userId);
                                                    }
                                                });

                                                TeamsDto teamsDto = new TeamsDto(
                                                        team.getTeam_id(),
                                                        team.getName(),
                                                        team.getDescription(),
                                                        spaces,
                                                        members
                                                );
                                                logger.info("Created TeamsDto: teamId={}, spaces={}, members={}",
                                                        teamsDto.getTeamId(),
                                                        teamsDto.getSpaces() != null ? teamsDto.getSpaces().size() : "null",
                                                        teamsDto.getMembers() != null ? teamsDto.getMembers().size() : "null");
                                                return teamsDto;
                                            });
                                });
                    });
        }

    @Override
    public Mono<Boolean> validateTeamInviteCode(UUID inviteCode) {
        logger.info("Validating team invite code: {}", inviteCode);

        return teamInvitesRepository.findById(inviteCode)
                .doOnNext(invite -> logger.info("Found team invite: {} with status: {}", inviteCode, invite.getStatus()))
                .switchIfEmpty(Mono.defer(() -> {
                    logger.warn("Team invite not found: {}", inviteCode);
                    return Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_04)));
                }))
                .flatMap(invite -> {
                    logger.info("Checking invite validity - Status: {}, Expires: {}", invite.getStatus(), invite.getExpires());

                    if (invite.getStatus() == InviteStatus.PENDING && invite.getExpires().isAfter(LocalDateTime.now())) {
                        logger.info("Team invite is valid: {}", inviteCode);
                        return Mono.just(true);
                    } else {
                        logger.warn("Team invite is invalid - Status: {}, Expired: {}",
                                invite.getStatus(), invite.getExpires().isBefore(LocalDateTime.now()));
                        return Mono.just(false);
                    }
                })
                .doOnError(error -> logger.error("Error validating team invite {}: {}", inviteCode, error.getMessage()))
                .timeout(Duration.ofSeconds(5));

    }

    @Override
    public Mono<String> addUserToTeam(UUID inviteId, UUID userId) {
        logger.info("Adding user {} to team using invite {}", userId, inviteId);

        return teamInvitesRepository.findById(inviteId)
                .doOnNext(invite -> logger.info("Found team invite: {} for team: {}", inviteId, invite.getTeamId()))
                .switchIfEmpty(Mono.defer(() -> {
                    logger.warn("Team invite not found: {}", inviteId);
                    return Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_04)));
                }))
                .flatMap(teamInvite -> processTeamInvite(teamInvite, userId))
                .doOnSuccess(result -> logger.info("Successfully added user {} to team", userId))
                .doOnError(error -> logger.error("Failed to add user {} to team with invite {}: {}",
                        userId, inviteId, error.getMessage(), error))
                .timeout(Duration.ofSeconds(10));

    }

    private Mono<String> processTeamInvite(TeamInvites teamInvite, UUID userId) {
        // Update invite status
        teamInvite.setStatus(InviteStatus.ACCEPTED);

        // Create team member
        TeamMembers teamMember = TeamMembers.builder()
                .teamId(teamInvite.getTeamId())
                .userId(userId)
                .role(teamInvite.getRole())
                .build();

        logger.info("Processing team invite - updating status and adding member to team: {}", teamInvite.getTeamId());

        return teamInvitesRepository.save(teamInvite)
                .doOnNext(savedInvite -> logger.info("Team invite status updated to ACCEPTED: {}", savedInvite.getInviteId()))
                .then(teamMembersRepository.save(teamMember))
                .doOnNext(savedMember -> logger.info("Team member added successfully: userId={}, teamId={}, role={}",
                        savedMember.getUserId(), savedMember.getTeamId(), savedMember.getRole()))
                .map(savedMember -> "User successfully added to team")
                .doOnError(error -> logger.error("Error processing team invite for user {} and team {}: {}",
                        userId, teamInvite.getTeamId(), error.getMessage()));
    }

}

