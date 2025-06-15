package org.atlas.interfaces;

import reactor.core.publisher.Mono;

public interface CompanyServiceInterface {

    Mono<String> registerWithCompany(String inviteCode, String userId);

    Mono<Boolean> validateInviteCode(String inviteCode);
}
