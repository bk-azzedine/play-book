package org.atlas.services;

import org.atlas.dtos.BlockDto;
import org.atlas.dtos.ContentDto;
import org.atlas.dtos.DocumentDto;
import org.atlas.dtos.UserDto;
import org.atlas.entities.DocumentEntity;
import org.atlas.enums.RoutingKeys;
import org.atlas.exceptions.Exception;
import org.atlas.exceptions.ExceptionHandler;
import org.atlas.interfaces.DocumentPublishServiceInterface;
import org.atlas.interfaces.DocumentServiceInterface;
import org.atlas.interfaces.UserServiceInterface;
import org.atlas.messages.DocumentMessage;
import org.atlas.repository.DocumentRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static org.atlas.exceptions.Exceptions.EXCEPTION_01;

@Service
public class DocumentService implements DocumentServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    private final UserServiceInterface userService;

    private final DocumentPublishServiceInterface documentPublishService;

    private final ModelMapper modelMapper;
    private final DocumentRepository documentRepository;

    @Autowired
    public DocumentService(UserServiceInterface userService, DocumentPublishService documentPublishService, ModelMapper modelMapper, DocumentRepository documentRepository) {
        this.userService = userService;
        this.documentPublishService = documentPublishService;
        this.modelMapper = modelMapper;
        this.documentRepository = documentRepository;
        logger.info("DocumentService initialized with UserServiceInterface: {} and DocumentRepository: {}",
                userService.getClass().getSimpleName(),
                documentRepository.getClass().getSimpleName()
        );
    }

    /**
     * Saves a DocumentEntity and publishes a message to the document exchange.
     *
     * @param entity The DocumentEntity to save.
     * @return A Mono containing the saved DocumentEntity.
     */


    @Override
    public Mono<DocumentDto> save(DocumentEntity entity) {
        if (entity == null) {
            return Mono.error(new IllegalArgumentException("DocumentEntity cannot be null for saving."));
        }

        logger.info("Attempting to save document: {}", entity);

        return documentRepository.save(entity)
                .doOnSubscribe(sub -> logger.debug("Subscribed to document save operation"))
                .doOnSuccess(savedDoc -> {
                    logger.info("Successfully saved document with ID: {}", savedDoc.getId());

                    // Handle the async message preparation and publishing
                    prepareMessage(savedDoc)
                            .flatMap(messageData ->
                                    Mono.fromCallable(() ->
                                            documentPublishService.publishMessage(
                                                    "data-exchange",
                                                    RoutingKeys.DOCUMENT_VECTORIZE.getValue(),
                                                    messageData
                                            )
                                    )
                            )
                            .subscribeOn(Schedulers.boundedElastic())
                            .doOnError(publishError -> logger.error(
                                    "Failed to publish message for saved document ID: {}. Error: {}",
                                    savedDoc.getId(), publishError.getMessage(), publishError))
                            .subscribe(
                                    published -> {
                                        if (published) {
                                            logger.debug("Publish message initiated for document ID: {}", savedDoc.getId());
                                        } else {
                                            logger.warn("Publish message returned false for document ID: {}", savedDoc.getId());
                                        }
                                    },
                                    error -> {
                                        // Already handled in doOnError
                                    },
                                    () -> logger.debug("Publish message complete for document ID: {}", savedDoc.getId())
                            );
                })
                .doOnError(error -> logger.error(
                        "Failed to save document: {}. Error: {}", entity, error.getMessage(), error))
                .doOnTerminate(() -> logger.debug("Document save operation terminated for entity: {}", entity))
                .flatMap(savedEntity -> {
                    // Convert the saved entity to DTO
                    DocumentDto docDto = modelMapper.map(savedEntity, DocumentDto.class);

                    // If there are no authors, return the DTO as is
                    if (savedEntity.getAuthors() == null || savedEntity.getAuthors().isEmpty()) {
                        return Mono.just(docDto);
                    }

                    // Convert author IDs from String to UUID
                    List<UUID> authorUuids = savedEntity.getAuthors().stream()
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
                                        savedEntity.getId(), err.getMessage());
                                // Return the document DTO without author details in case of error
                                return Mono.just(docDto);
                            });
                });
    }


    @Override
    public Flux<DocumentDto> getRecentUserDocs(String organization, String user) {
        Flux<DocumentEntity> docs = documentRepository.findDocumentEntitiesByAuthorsContainsAndOrganizationAndLastUpdatedAfter(
                List.of(user), organization, LocalDateTime.now().minusDays(6));

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

    @Override
    public Mono<DocumentDto> findSelectedDocument(String docId) {
        return documentRepository.findById(docId)
                .doOnSubscribe(sub -> logger.debug("Subscribed to findSelectedDocument with UUID: {}", docId))
                .doOnNext(doc -> logger.info("Found document: {}", doc))
                .doOnSuccess(doc -> logger.info("Completed fetching document for UUID: {}", docId))
                .doOnError(error -> logger.error("Failed to fetch document for UUID: {}", docId, error))
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

    @Override
    public Flux<DocumentDto> getSpaceDocs(String spaceId) {
        Flux<DocumentEntity> docs = documentRepository.findAllBySpace(spaceId);

        return docs.doOnSubscribe(sub -> logger.debug("Subscribed to findDocumentEntitiesByAuthorsContains with UUID: {}", spaceId))
                .doOnNext(doc -> logger.info("Found document: {}", doc))
                .doOnComplete(() -> logger.info("Completed fetching documents for UUID: {}", spaceId))
                .doOnError(error -> logger.error("Failed to fetch documents for UUID: {}", spaceId, error))
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

    public String extractPlainText(ContentDto content) {
        if (content == null || content.getBlocks() == null) {
            return "";
        }

        StringBuilder textBuilder = new StringBuilder();

        for (BlockDto block : content.getBlocks()) {
            if (block.getData() != null && block.getData().containsKey("text")) {
                String text = (String) block.getData().get("text");
                if (text != null && !text.trim().isEmpty()) {
                    textBuilder.append(text.trim());
                    textBuilder.append("\n\n");
                }
            }
        }

        // Remove trailing newlines
        return textBuilder.toString().trim();
    }

    public Mono<Map<String, Object>> prepareMessage(DocumentEntity savedDoc) {
        // Check if authors exist
        if (savedDoc.getAuthors() == null || savedDoc.getAuthors().isEmpty()) {
            return Mono.just(buildCeleryMessage(savedDoc, new String[0]));
        }

        // Convert author IDs from String to UUID
        List<UUID> authorUuids = savedDoc.getAuthors().stream()
                .map(UUID::fromString)
                .collect(Collectors.toList());

        // Fetch author details and build message
        return userService.getDocAuthors(authorUuids)
                .collectList()
                .map(authorDtos -> {
                    // Convert author DTOs to string array
                    String[] authorStrings = authorDtos.stream()
                            .map(UserDto::toString) // or author.getName() if you prefer just names
                            .toArray(String[]::new);

                    return buildCeleryMessage(savedDoc, authorStrings);
                })
                .onErrorResume(err -> {
                    logger.error("Error fetching author details for document {}: {}",
                            savedDoc.getId(), err.getMessage());
                    // Return message without author details in case of error
                    return Mono.just(buildCeleryMessage(savedDoc, new String[0]));
                });
    }

    private Map<String, Object> buildCeleryMessage(DocumentEntity savedDoc, String[] authors) {
        DocumentMessage documentMessage = DocumentMessage.builder()
                .id(savedDoc.getId())
                .title(savedDoc.getTitle())
                .description(savedDoc.getDescription())
                .content(extractPlainText(modelMapper.map(savedDoc.getContent(), ContentDto.class)))
                .organization(savedDoc.getOrganization())
                .space(savedDoc.getSpace())
                .authors(authors) // Now contains actual author details as strings
                .tags(savedDoc.getTags().toArray(new String[0]))
                .build();
        logger.info("vectorize_document message: {}", documentMessage);
        Map<String, Object> celeryMessage = new HashMap<>();
        celeryMessage.put("id", UUID.randomUUID().toString());
        celeryMessage.put("task", "embed_service.tasks.vectorize_document");
        celeryMessage.put("args", new ArrayList<>());
        celeryMessage.put("kwargs", Map.of("document_data", documentMessage));
        celeryMessage.put("retries", 0);
        celeryMessage.put("eta", null);
        return celeryMessage;
    }


    @Override
    public Flux<DocumentDto> getAllDocs(String organization, String user) {
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

    @Override
    public Flux<DocumentDto> getDraftDocs(String organization, String user, boolean draft) {
        Flux<DocumentEntity> docs = documentRepository.findDocumentEntitiesByAuthorsContainsAndOrganizationAndDraft(List.of(user), organization, draft);
        return applyCommonDocFluxLogging(docs, "draft documents with status: " + draft);
    }

    @Override
    public Flux<DocumentDto> getFavoriteDocs(String organization, String user, boolean favorite) {
        Flux<DocumentEntity> docs = documentRepository.findDocumentEntitiesByAuthorsContainsAndOrganizationAndFavorite(List.of(user), organization, favorite);
        return applyCommonDocFluxLogging(docs, "favorite documents with status: " + favorite);
    }

    /**
     * Applies common logging and author fetching logic to a Flux of DocumentEntity.
     *
     * @param docsFlux       The Flux of DocumentEntity to process.
     * @param contextMessage A descriptive message for the logging context (e.g., "draft documents").
     * @return A Flux of DocumentDto with applied logging and author details.
     */
    private Flux<DocumentDto> applyCommonDocFluxLogging(Flux<DocumentEntity> docsFlux, String contextMessage) {
        return docsFlux
                .doOnSubscribe(sub -> logger.debug("Subscribed to fetch {}", contextMessage))
                .doOnNext(doc -> logger.info("Found {}: {}", contextMessage.split(" ")[0], doc.getId())) // Log specific doc ID
                .doOnComplete(() -> logger.info("Completed fetching {}", contextMessage))
                .doOnError(error -> logger.error("Failed to fetch {}. Error: {}", contextMessage, error.getMessage(), error))
                .flatMap(docEntity -> {
                    DocumentDto docDto = modelMapper.map(docEntity, DocumentDto.class);

                    if (docEntity.getAuthors() == null || docEntity.getAuthors().isEmpty()) {
                        return Mono.just(docDto);
                    }

                    List<UUID> authorUuids = docEntity.getAuthors().stream()
                            .map(UUID::fromString)
                            .collect(Collectors.toList());

                    return userService.getDocAuthors(authorUuids)
                            .collectList()
                            .map(authorDtos -> {
                                docDto.setAuthors(authorDtos);
                                return docDto;
                            })
                            .onErrorResume(err -> {
                                logger.error("Error fetching author details for document {}: {}. Returning document without authors.",
                                        docEntity.getId(), err.getMessage());
                                return Mono.just(docDto);
                            });
                });
    }

    @Override
    public Mono<Void> deleteSpaceDocuments(String spaceId) {
        if (spaceId == null || spaceId.isEmpty()) {
            logger.error("Document ID cannot be null or empty for deletion.");
            return Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_01)));
        }

        return documentRepository.deleteAllBySpace(spaceId)
                .doOnSubscribe(sub -> logger.debug("Subscribed to delete document with ID: {}", spaceId))
                .doOnSuccess(aVoid -> logger.info("Successfully deleted document with ID: {}", spaceId))
                .doOnError(error -> logger.error("Failed to delete document with ID: {}. Error: {}", spaceId, error.getMessage(), error));
    }
}


