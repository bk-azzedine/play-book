# Notification Service Architecture and Implementation Plan

## 1. Overview

The notification service will be a new microservice in the Play-Book API architecture responsible for managing and delivering notifications to users based on various actions and events occurring throughout the system. This service will provide both real-time notifications via WebSockets and REST API endpoints for retrieving notification history.

## 2. Architecture

### 2.1 Service Positioning in the Microservice Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  User Service   │     │    Document     │     │  Organization   │
│                 │     │    Service      │     │    Service      │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         └─────────────►│    RabbitMQ     │◄─────────────┘
                        │  Message Broker │
                        └────────┬────────┘
                                 │
                                 │
                                 ▼
                        ┌─────────────────┐
                        │  Notification   │
                        │    Service      │
                        └────────┬────────┘
                                 │
                                 │
                        ┌────────┴────────┐
                        │   API Gateway   │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │    Frontend     │
                        │  Application    │
                        └─────────────────┘
```

### 2.2 Core Components

1. **Notification Listener**: Consumes events from RabbitMQ that should generate notifications
2. **Notification Manager**: Core service that processes and stores notifications
3. **Notification Repository**: Stores notification data in the database
4. **REST API Controller**: Provides endpoints for retrieving and managing notifications
5. **WebSocket Handler**: Manages real-time notification delivery
6. **Notification Processor**: Transforms events into appropriate notification formats

## 3. Data Model

### 3.1 Notification Entity

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("notifications")
public class Notification {
    @Id
    private UUID id;
    
    private UUID userId;              // Target user
    private String type;              // Notification type (e.g., DOCUMENT_SHARED, TEAM_INVITE)
    private String title;             // Short notification title
    private String message;           // Notification content
    private Map<String, Object> data; // Additional data specific to notification type
    private boolean read;             // Whether the notification has been read
    private LocalDateTime createdAt;  // When the notification was created
    private LocalDateTime readAt;     // When the notification was read
    private String sourceService;     // Which service generated this notification
    private UUID sourceEntityId;      // ID of the entity that triggered the notification
}
```

### 3.2 Notification Types

Based on the existing codebase analysis, the following notification types have been identified:

1. **User-related notifications**:
   - Account activation
   - Password reset
   - Profile updates

2. **Team-related notifications**:
   - Team invitation
   - Team membership changes
   - Team role changes

3. **Document-related notifications**:
   - Document shared
   - Document updated
   - Document commented
   - Document mentioned

4. **Organization-related notifications**:
   - Organization membership changes
   - Organization role changes

## 4. Integration with Existing Services

### 4.1 RabbitMQ Integration

The notification service will connect to the existing RabbitMQ message broker and listen for events from other services. Based on the existing code, we can see that services already publish messages to RabbitMQ with specific routing keys.

```java
// Example of how the notification service will listen for events
@Configuration
public class NotificationListener {

    private final NotificationService notificationService;
    private final Logger logger = LoggerFactory.getLogger(NotificationListener.class);

    @Autowired
    public NotificationListener(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @RabbitListener(queues = "${spring.rabbitmq.notification-queue}")
    public void receiveMessage(HashMap<String, Object> message) {
        logger.info("Received message: {}", message);
        
        String messageType = (String) message.get("messageType");
        
        if (messageType == null) {
            logger.error("Message type not specified in the message: {}", message);
            return;
        }
        
        switch (messageType) {
            case "TEAM_INVITE":
                handleTeamInvite(message);
                break;
            case "DOCUMENT_SHARED":
                handleDocumentShared(message);
                break;
            // Handle other message types
            default:
                logger.warn("Unknown message type: {}", messageType);
        }
    }
    
    private void handleTeamInvite(HashMap<String, Object> message) {
        // Process team invite notification
        notificationService.createNotification(
            UUID.fromString((String) message.get("userId")),
            "TEAM_INVITE",
            "Team Invitation",
            "You've been invited to join " + message.get("team_name"),
            message
        );
    }
    
    // Other handlers for different message types
}
```

### 4.2 Routing Keys

The notification service will need to listen for the following routing keys (based on the existing code):

- `user.activate.account` - For user activation events
- `team.invite` - For team invitation events
- `document.vectorize` - For document-related events

Additional routing keys will be defined for other notification types.

## 5. Frontend Integration

### 5.1 REST API Endpoints

The notification service will provide the following REST API endpoints:

```
GET /api/notifications - Get all notifications for the authenticated user
GET /api/notifications/unread - Get unread notifications for the authenticated user
PUT /api/notifications/{id}/read - Mark a notification as read
PUT /api/notifications/read-all - Mark all notifications as read
DELETE /api/notifications/{id} - Delete a notification
```

### 5.2 WebSocket Integration

For real-time notifications, the service will implement WebSocket support:

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-notifications")
                .setAllowedOrigins("*")
                .withSockJS();
    }
}
```

Clients will subscribe to their personal notification channel:

```
/user/{userId}/notifications
```

## 6. REST vs WebSocket Comparison

### 6.1 REST Approach

**Pros:**
- Simpler implementation
- Follows standard HTTP patterns
- Easier to secure with existing authentication mechanisms
- Better for retrieving notification history

**Cons:**
- Requires polling for new notifications
- Higher latency for real-time notifications
- More server load due to frequent polling

### 6.2 WebSocket Approach

**Pros:**
- Real-time delivery of notifications
- Lower latency
- Reduced server load (no polling)
- Better user experience for immediate notifications

**Cons:**
- More complex implementation
- Requires managing WebSocket connections
- Needs fallback mechanisms for clients that don't support WebSockets

### 6.3 Recommendation

**Implement both approaches:**
1. Use WebSockets for real-time notification delivery
2. Use REST API for notification history and management

This hybrid approach provides the best user experience while maintaining compatibility with all clients. WebSockets will be used for pushing new notifications in real-time, while the REST API will be used for retrieving notification history and managing notifications (marking as read, deleting, etc.).

## 7. Implementation Plan

### 7.1 Phase 1: Core Service Setup

1. Create a new Spring Boot project for the notification service
2. Set up dependencies (Spring WebFlux, Spring AMQP, Spring Data R2DBC, etc.)
3. Configure RabbitMQ connection
4. Implement the notification entity and repository
5. Create the core notification service

### 7.2 Phase 2: Message Queue Integration

1. Implement RabbitMQ listeners for different event types
2. Create handlers for processing different notification types
3. Set up message converters and error handling
4. Test integration with existing services

### 7.3 Phase 3: REST API Implementation

1. Create controllers for notification management
2. Implement endpoints for retrieving notifications
3. Add endpoints for marking notifications as read
4. Implement security and authentication

### 7.4 Phase 4: WebSocket Implementation

1. Set up WebSocket configuration
2. Create handlers for real-time notification delivery
3. Implement connection management and authentication
4. Add support for user-specific notification channels

### 7.5 Phase 5: Testing and Integration

1. Write unit tests for all components
2. Perform integration testing with other services
3. Load test the notification service
4. Document the API and integration points

## 8. Technology Stack

- **Framework**: Spring Boot 3.x
- **Reactive Programming**: Project Reactor (Mono/Flux)
- **Database**: PostgreSQL with R2DBC for reactive access
- **Message Queue**: RabbitMQ
- **API**: REST and WebSocket
- **Security**: Spring Security with JWT authentication
- **Documentation**: SpringDoc OpenAPI

## 9. Notification Flow Examples

### 9.1 Team Invitation Flow

1. Team Service sends a team invite message to RabbitMQ
2. Notification Service receives the message
3. Notification Service creates a notification for the invited user
4. If the user is online (WebSocket connected), the notification is sent immediately
5. The notification is stored in the database for later retrieval via REST API

### 9.2 Document Update Flow

1. Document Service saves a document and sends a message to RabbitMQ
2. Notification Service receives the message
3. Notification Service identifies users who should be notified (document authors, team members)
4. Notifications are created for each relevant user
5. Notifications are sent via WebSocket to online users
6. Notifications are stored for later retrieval

## 10. Conclusion

The notification service will enhance the user experience by providing timely updates about relevant activities within the system. By implementing both REST and WebSocket approaches, the service will offer real-time notifications while maintaining compatibility with all clients.

The service is designed to be scalable, with clear integration points with existing services through RabbitMQ. The implementation plan provides a phased approach to building the service, starting with core functionality and progressively adding more advanced features.