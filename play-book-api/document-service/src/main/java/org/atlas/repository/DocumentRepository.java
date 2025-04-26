package org.atlas.repository;

import org.atlas.entities.DocumentEntity;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.UUID;

@Repository
public interface DocumentRepository extends ReactiveMongoRepository<DocumentEntity, String> {

    Flux<DocumentEntity> findDocumentEntitiesByAuthorsContains(List<String> authors);
}
