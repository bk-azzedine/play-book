package org.atlas.controllers;

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
    public Mono<ResponseEntity<DocumentEntity>> save(@RequestBody DocumentEntity entity) {
        return documentService.save(entity).map(doc -> ResponseEntity.ok().body(doc));
    }
    @GetMapping
    public Mono<ResponseEntity<Flux<DocumentEntity>>> getRecentDocs(@RequestHeader("email") String email) {
        Flux<DocumentEntity> docs = documentService.getRecentUserDocs(email);
        return Mono.just(ResponseEntity.ok().body(docs));
    }
}
