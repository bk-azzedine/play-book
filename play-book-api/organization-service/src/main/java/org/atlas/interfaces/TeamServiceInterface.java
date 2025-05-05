package org.atlas.interfaces;

import org.atlas.dtos.TeamsDto;
import org.atlas.entities.Team;
import org.atlas.requests.TeamInviteRequest;
import org.atlas.requests.TeamRequest;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface TeamServiceInterface {
    Mono<Team> saveTeam(TeamRequest team);

    Mono<String> inviteToTeam(TeamInviteRequest team);

    Flux<TeamsDto> getOrgTeams (UUID orgId);
}
