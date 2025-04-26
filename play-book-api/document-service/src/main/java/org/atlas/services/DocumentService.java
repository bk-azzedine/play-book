package org.atlas.services;

import org.atlas.entities.DocumentEntity;
import org.atlas.interfaces.DocumentServiceInterface;
import org.atlas.interfaces.UserServiceInterface;
import org.atlas.repository.DocumentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class DocumentService implements DocumentServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    private final UserServiceInterface userService;
    private final DocumentRepository documentRepository;

    @Autowired
    public DocumentService(UserServiceInterface userService, DocumentRepository documentRepository) {
        this.userService = userService;
        this.documentRepository = documentRepository;
        logger.info("DocumentService initialized with UserServiceInterface: {} and DocumentRepository: {}",
                userService.getClass().getSimpleName(),
                documentRepository.getClass().getSimpleName()
        );
    }

    @Override
    public Mono<DocumentEntity> save(DocumentEntity entity) {
        logger.info("Saving document: {}", entity);
        return documentRepository.save(entity)
                .doOnSubscribe(sub -> logger.debug("Subscribed to save document"))
                .doOnSuccess(savedDoc -> logger.info("Successfully saved document: {}", savedDoc))
                .doOnError(error -> logger.error("Failed to save document: {}", entity, error));
    }

    @Override
    public Flux<DocumentEntity> getRecentUserDocs(String email) {
        logger.info("Fetching recent documents for user with email: {}", email);
        return userService.getUserByEmail(email)
                .doOnSubscribe(sub -> logger.debug("Subscribed to getUserByEmail for email: {}", email))
                .doOnNext(uuid -> logger.info("Found user UUID: {}", uuid))
                .doOnError(error -> logger.error("Failed to fetch user by email: {}", email, error))
                .flatMapMany(uuid -> {
                    logger.info("Fetching documents authored by UUID: {}", uuid);
                    Flux<DocumentEntity> docs = documentRepository.findDocumentEntitiesByAuthorsContains(List.of(String.valueOf(uuid)));

                    return docs.doOnSubscribe(sub -> logger.debug("Subscribed to findDocumentEntitiesByAuthorsContains with UUID: {}", uuid))
                            .doOnNext(doc -> logger.info("Found document: {}", doc))
                            .doOnComplete(() -> logger.info("Completed fetching documents for UUID: {}", uuid))
                            .doOnError(error -> logger.error("Failed to fetch documents for UUID: {}", uuid, error));
                });
    }
}
