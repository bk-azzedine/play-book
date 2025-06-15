package org.atlas.interfaces;

import org.atlas.dtos.OrganizationDto;
import org.atlas.entities.Organization;
import org.atlas.requests.OrganizationRequest;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface CompanyServiceInterface {
    Mono<Organization> save(OrganizationRequest organization, String  email);

    Flux<OrganizationDto> findAllRelatedToUser(UUID userId);
    Mono<OrganizationDto> findUserOrganization(UUID userId, UUID organizationId);

    String getInitials(String companyName);

    boolean isCommonWord(String word);

    String getCompanyColor(String companyName);

    Mono<Boolean> validateInviteCode(UUID inviteCode);
}
