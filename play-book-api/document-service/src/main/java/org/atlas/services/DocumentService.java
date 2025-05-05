package org.atlas.services;

import org.atlas.dtos.DocumentDto;
import org.atlas.entities.DocumentEntity;
import org.atlas.interfaces.DocumentServiceInterface;
import org.atlas.interfaces.UserServiceInterface;
import org.atlas.repository.DocumentRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DocumentService implements DocumentServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    private final UserServiceInterface userService;

    private final ModelMapper modelMapper;
    private final DocumentRepository documentRepository;

    @Autowired
    public DocumentService(UserServiceInterface userService, ModelMapper modelMapper, DocumentRepository documentRepository) {
        this.userService = userService;
        this.modelMapper = modelMapper;
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
    public Flux<DocumentDto> getRecentUserDocs(String organization, String user) {
        Flux<DocumentEntity> docs = documentRepository.findDocumentEntitiesByAuthorsContainsAndOrganization(
                List.of(user), organization);

        return docs.doOnSubscribe(sub -> logger.debug("Subscribed to findDocumentEntitiesByAuthorsContains with UUID: {}", user))
                .doOnNext(doc -> logger.info("Found document: {}", doc))
                .doOnComplete(() -> logger.info("Completed fetching documents for UUID: {}", user))
                .doOnError(error -> logger.error("Failed to fetch documents for UUID: {}", user, error))
                .flatMap(docEntity -> {
                    // Convert the entity to DTO
                    DocumentDto docDto = modelMapper.map(docEntity, DocumentDto.class);

                    // If there are no authors, return the DTO as is
                    if (docEntity.getAuthors() == null || docEntity.getAuthors().isEmpty()) {
                        return Mono.just(docDto);
                    }

                    // Convert author IDs from String to UUID
                    List<UUID> authorUuids = docEntity.getAuthors().stream()
                            .map(UUID::fromString)
                            .collect(Collectors.toList());

                    // Use the existing getDocAuthors method to fetch author details
                    return userService.getDocAuthors(authorUuids)
                            .collectList()
                            .map(authorDtos -> {
                                // Set the fetched author details in the document DTO
                                docDto.setAuthors(authorDtos);
                                return docDto;
                            })
                            .onErrorResume(err -> {
                                logger.error("Error fetching author details for document {}: {}",
                                        docEntity.getId(), err.getMessage());
                                // Return the document DTO without author details in case of error
                                return Mono.just(docDto);
                            });
                });
    }

}


