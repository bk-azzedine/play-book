package org.atlas.services;

import org.atlas.entities.Team;
import org.atlas.entities.TeamMembers;
import org.atlas.enums.TeamRole;
import org.atlas.interfaces.TeamServiceInterface;

import org.atlas.repositories.OrganizationRepository;
import org.atlas.repositories.TeamMembersRepository;
import org.atlas.repositories.TeamRepository;
import org.atlas.requests.TeamRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class TeamService implements TeamServiceInterface {

    final TeamRepository teamRepository;
    final TeamMembersRepository teamMembersRepository;
    final OrganizationRepository organizationRepository;
    final Logger logger =
            LoggerFactory.getLogger(TeamService.class);

    @Autowired
    public TeamService(TeamRepository teamRepository, TeamMembersRepository teamMembersRepository, OrganizationRepository organizationRepository) {
        this.teamRepository = teamRepository;
        this.teamMembersRepository = teamMembersRepository;
        this.organizationRepository = organizationRepository;
    }

    @Override
    public Mono<Team> saveTeam(TeamRequest team) {
        logger.info("Initiating save operation for team: {}", team.teamName());

        Team newTeam = Team.builder()
                .name(team.teamName())
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

}
