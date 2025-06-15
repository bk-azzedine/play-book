package org.atlas.interfaces;

import org.atlas.dtos.DocumentDto;
import org.atlas.entities.DocumentEntity;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface DocumentServiceInterface {
    public Mono<DocumentDto> save(DocumentEntity entity);

    Flux<DocumentDto> getRecentUserDocs(String organization, String user);
    Flux<DocumentDto> getAllDocs(String organization, String user);
    Flux<DocumentDto> getDraftDocs(String organization, String user, boolean draft);
    Flux<DocumentDto> getFavoriteDocs(String organization, String user, boolean favorite);


    Mono<DocumentDto> findSelectedDocument(String docId);

    Flux<DocumentDto> getSpaceDocs(String spaceId);

    Mono<Void> deleteSpaceDocuments(String spaceId);
}
