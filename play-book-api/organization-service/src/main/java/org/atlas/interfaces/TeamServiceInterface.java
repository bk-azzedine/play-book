package org.atlas.interfaces;

import org.atlas.entities.Team;
import org.atlas.requests.TeamInviteRequest;
import org.atlas.requests.TeamRequest;
import reactor.core.publisher.Mono;

public interface TeamServiceInterface {
    Mono<Team> saveTeam(TeamRequest team);

    Mono<String> inviteToTeam(TeamInviteRequest team);
}
