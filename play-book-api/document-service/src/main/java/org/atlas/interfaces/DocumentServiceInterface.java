package org.atlas.interfaces;

import org.atlas.entities.DocumentEntity;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface DocumentServiceInterface {
    public Mono<DocumentEntity> save(DocumentEntity entity);

    Flux<DocumentEntity> getRecentUserDocs(String email);
}
