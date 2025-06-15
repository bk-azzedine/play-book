package org.atlas.controllers;


import org.atlas.dtos.TeamsDto;
import org.atlas.entities.Team;
import org.atlas.interfaces.TeamServiceInterface;
import org.atlas.requests.MultipleTeamInviteRequest;
import org.atlas.requests.TeamInviteRequest;
import org.atlas.requests.TeamRequest;
import org.atlas.responses.DeclineInviteResponse;
import org.atlas.responses.InviteResponse;
import org.atlas.services.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

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

    @PostMapping("/invite/multiple")
    public Mono<ResponseEntity<Flux<InviteResponse>>>  inviteMultiple(@RequestBody MultipleTeamInviteRequest multipleTeamInviteRequest) {
        return teamService.inviteMultipleToTeam(multipleTeamInviteRequest).map(
                res ->
                        ResponseEntity.ok().body(Flux.fromStream(res.stream().map(InviteResponse::new)))
        );
    }

    @PostMapping("/invite/decline/{inviteId}")
    public Mono<ResponseEntity<DeclineInviteResponse>>  DeclineInvite(@PathVariable("inviteId") UUID inviteId) {
        return teamService.DeclineInvite(inviteId).map(
                res ->
                        ResponseEntity.ok().body(new DeclineInviteResponse(res))
        );
    }

    @PostMapping("/add-user/{inviteId}/{userId}")
    private Mono<ResponseEntity<String>> addUserToTeam(@PathVariable("inviteId") UUID inviteId, @PathVariable("userId") UUID userId) {
        return teamService.addUserToTeam(inviteId, userId)
                .map(result -> ResponseEntity.ok("User added to team successfully"));
    }

}
