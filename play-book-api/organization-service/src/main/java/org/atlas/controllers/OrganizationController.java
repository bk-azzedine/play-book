package org.atlas.controllers;

import org.atlas.dtos.OrganizationDto;
import org.atlas.entities.Organization;
import org.atlas.interfaces.CompanyServiceInterface;
import org.atlas.requests.OrganizationRequest;
import org.atlas.services.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/org/company")
public class OrganizationController {
    private final CompanyServiceInterface companyService;


    @Autowired
    public OrganizationController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping()
    public Mono<ResponseEntity<Organization>> save(@RequestBody OrganizationRequest organization, @RequestHeader("email") String email) {
        return companyService.save(organization, email ).map(savedOrg -> ResponseEntity.ok().body(savedOrg));
    }

    @GetMapping("all/{userId}")
    public Mono<ResponseEntity<Flux<OrganizationDto>>> getOrganizations(@PathVariable("userId") UUID userId) {
        Flux<OrganizationDto> organizationFlux = companyService.findAllRelatedToUser(userId);
        return Mono.just(ResponseEntity.ok(organizationFlux));
    }

    @GetMapping("/{userId}/{organizationId}")
    public Mono<ResponseEntity<OrganizationDto>> getOrganization(@PathVariable("userId") UUID userId, @PathVariable("organizationId") UUID organizationId) {
        return companyService.findUserOrganization(userId, organizationId)
                .map(organizationDto ->{
                        System.out.println(organizationDto);
                      return  ResponseEntity.ok().body(organizationDto);});
    }

    @GetMapping("/invite-code/validate/{inviteCode}")
    public Mono<ResponseEntity<Boolean>> validateInviteCode(@PathVariable("inviteCode") UUID inviteCode) {
        return companyService.validateInviteCode(inviteCode)
                .map(isValid -> ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, "application/json").body(isValid));
    }
}

