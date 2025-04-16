package org.atlas.interfaces;

import org.atlas.entities.Organization;
import org.atlas.requests.OrganizationRequest;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface CompanyServiceInterface {
    Mono<Organization> save(OrganizationRequest organization, String  email);
}
