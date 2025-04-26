package org.atlas.services;

import org.atlas.entities.Organization;

import org.atlas.interfaces.CompanyServiceInterface;
import org.atlas.interfaces.UserServiceInterface;
import org.atlas.repositories.OrganizationRepository;
import org.atlas.requests.OrganizationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class CompanyService implements CompanyServiceInterface {
    private final OrganizationRepository organizationRepository;
    private final UserServiceInterface userService;
    final Logger logger =
            LoggerFactory.getLogger(CompanyService.class);

    @Autowired
    public CompanyService(OrganizationRepository organizationRepository, UserService userService) {
        this.organizationRepository = organizationRepository;
        this.userService = userService;
    }

    @Override
    public Mono<Organization> save(OrganizationRequest organization, String email) {
        logger.info("Initiating save operation for organization: {}", organization.name());
        return userService.getUserByEmail(email)
                .doOnNext(userId -> logger.debug("Retrieved userId: {}", userId))
                .flatMap(userId -> {
                    Organization newOrg = Organization.builder()
                            .name(organization.name())
                            .field(organization.field().name())
                            .ownerId(userId)
                            .build();
                    logger.debug("Constructed Organization entity: {}", newOrg);
                    return organizationRepository.save(newOrg)
                            .doOnSuccess(savedOrg -> logger.info("Successfully saved organization with ID: {}", savedOrg.getOrganizationId()));
                })
                .doOnError(error -> logger.error("Error occurred while saving organization", error));
    }
}
