package org.atlas.interfaces;

import org.atlas.dtos.TeamsDto;
import org.atlas.entities.Team;
import org.atlas.requests.MultipleTeamInviteRequest;
import org.atlas.requests.TeamInviteRequest;
import org.atlas.requests.TeamRequest;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

public interface TeamServiceInterface {
    Mono<Team> saveTeam(TeamRequest team);

    Mono<String> inviteToTeam(TeamInviteRequest team);
    Mono<List<String>> inviteMultipleToTeam(MultipleTeamInviteRequest team);
    Mono<String> DeclineInvite(UUID inviteId);

    Flux<TeamsDto> getOrgTeams (UUID orgId);

    Mono<Boolean> validateTeamInviteCode(UUID inviteCode);

    Mono<String> addUserToTeam(UUID inviteId, UUID userId);


}
