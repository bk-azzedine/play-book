package org.atlas.controllers;

import org.atlas.entities.Organization;
import org.atlas.entities.Team;
import org.atlas.interfaces.TeamServiceInterface;
import org.atlas.requests.TeamInviteRequest;
import org.atlas.requests.TeamRequest;
import org.atlas.responses.InviteResponse;
import org.atlas.services.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/org/team")
public class TeamController {
    private final TeamServiceInterface teamService;

    @Autowired
    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }


    @PostMapping()
    public Mono<ResponseEntity<Team>> save(@RequestBody TeamRequest team) {
        return teamService.saveTeam(team).map(savedOrg -> ResponseEntity.ok().body(savedOrg));
    }
    @PostMapping("/invite")
    public Mono<ResponseEntity<InviteResponse>> invite(@RequestBody TeamInviteRequest teamInviteRequest) {
        return teamService.inviteToTeam(teamInviteRequest).map(
                res ->
                        ResponseEntity.ok().body(new InviteResponse(res))
        );
    }
}
