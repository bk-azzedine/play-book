package org.atlas.repository;

import org.atlas.entities.DocumentEntity;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface DocumentRepository extends ReactiveMongoRepository<DocumentEntity, String> {

    Flux<DocumentEntity> findDocumentEntitiesByAuthorsContainsAndOrganizationAndLastUpdatedAfter(List<String> authors, String organization, LocalDateTime lastUpdated);
    Flux<DocumentEntity> findAllBySpace(String space);

    Flux<DocumentEntity> findDocumentEntitiesByAuthorsContainsAndOrganization(List<String> authors, String organization);

    Flux<DocumentEntity> findDocumentEntitiesByAuthorsContainsAndOrganizationAndDraft(List<String> authors, String organization, boolean draft);
    Flux<DocumentEntity> findDocumentEntitiesByAuthorsContainsAndOrganizationAndFavorite(List<String> authors, String organization, boolean favorite);

    Mono<Void> deleteAllBySpace(String space);

}
