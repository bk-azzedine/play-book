package org.atlas.listners;

import jakarta.mail.MessagingException;
import org.atlas.interfaces.DocumentServiceInterface;
import org.atlas.services.DocumentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;

@Component
public class Listener {

    private final DocumentServiceInterface documentService;
    private static final Logger logger = LoggerFactory.getLogger(Listener.class);

    @Autowired
    public Listener(DocumentService documentService) {
        this.documentService = documentService;
    }

    @RabbitListener(queues = "${spring.rabbitmq.template.default-receive-queue}")
    public void receiveMessage(HashMap<String, Object> map) throws MessagingException {
        logger.info("Received Message: {}", map);

        String messageType = (String) map.get("messageType");

        if (messageType == null) {
            logger.error("Message type not specified in the message: {}", map);
            return;
        }

        switch (messageType) {
            case "DOCUMENT_DELETE":
                handleDeleteDocument(map);
                break;
            default:
                logger.warn("Unknown message type: {}", messageType);
        }
    }

    private void handleDeleteDocument(HashMap<String, Object> map) {
        try {
            String spaceId = (String) map.get("spaceId");

            if (spaceId == null || spaceId.isEmpty()) {
                logger.error("Space ID is null or empty in DOCUMENT_DELETE message: {}", map);
                return;
            }

            logger.info("Processing document deletion for space ID: {}", spaceId);

            // If deleteSpaceDocuments returns a Mono, subscribe to it
            this.documentService.deleteSpaceDocuments(spaceId)
                    .doOnSuccess(result -> logger.info("Successfully deleted documents for space ID: {}", spaceId))
                    .doOnError(error -> logger.error("Failed to delete documents for space ID: {}. Error: {}", spaceId, error.getMessage(), error))
                    .subscribe();

        } catch (Exception e) {
            logger.error("Error processing DOCUMENT_DELETE message: {}", map, e);
        }
    }
}