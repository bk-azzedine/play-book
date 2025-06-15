package org.atlas.services;

import org.atlas.entities.Organization;
import org.atlas.entities.SpaceMembers;
import org.atlas.entities.TeamMembers;
import org.atlas.enums.OrganizationRoles;
import org.atlas.enums.SpacePrivileges;
import org.atlas.enums.TeamRole;
import org.atlas.interfaces.SecurityServiceInterface;
import org.atlas.repositories.OrganizationRepository;
import org.atlas.repositories.SpaceMembersRepository;
import org.atlas.repositories.TeamMembersRepository;
import org.atlas.responses.Claims;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuples;

import java.time.Duration;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;



@Service
public class SecurityService implements SecurityServiceInterface {

    private final TeamMembersRepository teamMembersRepository;
    private final SpaceMembersRepository spaceMembersRepository;
    private final OrganizationRepository organizationRepository;

    final Logger logger =
            LoggerFactory.getLogger(SecurityService.class);

    public SecurityService(TeamMembersRepository teamMembersRepository, SpaceMembersRepository spaceMembersRepository, OrganizationRepository organizationRepository) {
        this.teamMembersRepository = teamMembersRepository;
        this.spaceMembersRepository = spaceMembersRepository;
        this.organizationRepository = organizationRepository;
    }

    @Override
    public Mono<HashMap<String, List<?>>> getClaims(UUID user_id) {
        // Create final result container
        HashMap<String, List<?>> result = new HashMap<>();

        // Get all the user's associations
        Flux<Organization> organizations = organizationRepository.findAllByOwnerId(user_id)
                .timeout(Duration.ofSeconds(2));
        Flux<TeamMembers> teamMembers = teamMembersRepository.findAllByUserId(user_id)
                .timeout(Duration.ofSeconds(2));
        System.out.println(teamMembers);
        Flux<SpaceMembers> spaceMembers = spaceMembersRepository.findAllByUserId(user_id)
                .timeout(Duration.ofSeconds(2));

        // Process each type of entity and collect claims
        return Mono.zip(
                        organizations.map(organization ->
                                new Claims<OrganizationRoles>(organization.getOrganizationId(),OrganizationRoles.OWNER)
                        ).collectList().onErrorReturn(Collections.emptyList()),

                        teamMembers.map(teamMember ->
                                new Claims<TeamRole>(teamMember.getTeamId(), teamMember.getRole())
                        ).collectList().onErrorReturn(Collections.emptyList()),

                        spaceMembers.map(spaceMember ->
                                new Claims<SpacePrivileges>(spaceMember.getSpaceId(), spaceMember.getPrivilege())
                        ).collectList().onErrorReturn(Collections.emptyList())
                )
                .timeout(Duration.ofSeconds(3))
                .onErrorResume(error -> {
                    logger.error("Claims fetch failed: {}", error.getMessage());
                    return Mono.just(Tuples.of(
                            Collections.emptyList(),
                            Collections.emptyList(),
                            Collections.emptyList()
                    ));
                })
                .mapNotNull(tuple -> {
                    // Check if all lists are empty
                    if (tuple.getT1().isEmpty() && tuple.getT2().isEmpty() && tuple.getT3().isEmpty()) {
                        return null;
                    }

                    // Add all collected lists to the result map
                    result.put("organizations", tuple.getT1());
                    result.put("teams", tuple.getT2());
                    result.put("spaces", tuple.getT3());
                    return result;
                });
    }
}
