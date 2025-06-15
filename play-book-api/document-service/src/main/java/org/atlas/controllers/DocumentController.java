package org.atlas.controllers;

import org.atlas.dtos.DocumentDto;
import org.atlas.entities.DocumentEntity;
import org.atlas.interfaces.DocumentServiceInterface;
import org.atlas.services.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/doc/")
public class DocumentController {
    private final DocumentServiceInterface documentService;
    @Autowired
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping
    public Mono<ResponseEntity<DocumentDto>> save(@RequestBody DocumentEntity entity) {

        return documentService.save(entity).map(doc -> ResponseEntity.ok().body(doc));
    }


    @GetMapping("/organization/{organization}/user/{user}")
    public Mono<ResponseEntity<Flux<DocumentDto>>> getRecentDocs(@PathVariable("organization") String organization, @PathVariable("user") String user) {
        Flux<DocumentDto> docs = documentService.getRecentUserDocs(organization, user);

        return Mono.just(ResponseEntity.ok().body(docs));
    }

    @GetMapping("/{docId}")
    public Mono<ResponseEntity<DocumentDto>> getSelectDocument(@PathVariable("docId") String docId) {
       return documentService.findSelectedDocument(docId).map(doc -> ResponseEntity.ok().body(doc));
    }

    @GetMapping("/space/{spaceId}")
    public Mono<ResponseEntity<Flux<DocumentDto>>> getSpaceDocuments(@PathVariable("spaceId") String spaceId) {
        Flux<DocumentDto> docs = documentService.getSpaceDocs(spaceId);
        return Mono.just(ResponseEntity.ok().body(docs));
    }

    @GetMapping("/all/organization/{organization}/user/{user}")
    public Mono<ResponseEntity<Flux<DocumentDto>>> getAllUserDocs(@PathVariable("organization") String organization, @PathVariable("user") String user) {
        Flux<DocumentDto> docs = documentService.getAllDocs(organization, user);

        return Mono.just(ResponseEntity.ok().body(docs));
    }
    @GetMapping("/draft/organization/{organization}/user/{user}")
    public Mono<ResponseEntity<Flux<DocumentDto>>> getAllDraftDocs(@PathVariable("organization") String organization, @PathVariable("user") String user) {
        Flux<DocumentDto> docs = documentService.getDraftDocs(organization,  user, true);

        return Mono.just(ResponseEntity.ok().body(docs));
    }
    @GetMapping("/favorite/organization/{organization}/user/{user}")
    public Mono<ResponseEntity<Flux<DocumentDto>>> getAllFavoriteDocs(@PathVariable("organization") String organization, @PathVariable("user") String user) {
        Flux<DocumentDto> docs = documentService.getFavoriteDocs(organization, user, true);

        return Mono.just(ResponseEntity.ok().body(docs));
    }


}
