# Play-Book Microservices Architecture

This diagram shows the microservices architecture of the Play-Book application, including the communication methods between services and the databases they use.

```mermaid
graph TB
%% External clients
   Client[Client Applications]

%% API Gateway
   Gateway[API Gateway]

%% Service Registry and Config
   Registry[Registry Service]
   Config[Config Service]

%% Core Services
   Auth[Auth Service]
   User[User Service]
   Org[Organization Service]
   Doc[Document Service]
   Email[Email Service]

%% Chat Services
   Chat[Chat Service]
   Embed[Embed Service]
   Generate[Generate Service]

%% Databases
   AuthDB[(Auth DB<br>PostgreSQL)]
   UserDB[(User DB<br>PostgreSQL)]
   OrgDB[(Organization DB<br>PostgreSQL)]
   DocDB[(Document DB<br>MongoDB)]
   VectorDB[(Vector DB<br>ChromaDB)]

%% Message Broker
   RabbitMQ{RabbitMQ}

%% Client connections
   Client -->|HTTP| Gateway

%% Gateway routes
   Gateway -->|/api/auth/**| Auth
   Gateway -->|/api/user/**| User
   Gateway -->|/api/org/**| Org
   Gateway -->|/api/doc/**| Doc

%% Service Registry and Config connections
   Gateway -.->|Service Discovery| Registry
   Auth -.->|Service Discovery| Registry
   User -.->|Service Discovery| Registry
   Org -.->|Service Discovery| Registry
   Doc -.->|Service Discovery| Registry
   Email -.->|Service Discovery| Registry

   Gateway -.->|Configuration| Config
   Auth -.->|Configuration| Config
   User -.->|Configuration| Config
   Org -.->|Configuration| Config
   Doc -.->|Configuration| Config
   Email -.->|Configuration| Config

%% Database connections
   Auth -->|JDBC| AuthDB
   User -->|JDBC| UserDB
   Org -->|JDBC| OrgDB
   Doc -->|MongoDB Driver| DocDB
   Embed -->|HTTP| VectorDB

%% Service-to-service REST communication
   Doc -->|REST| User
   Org -->|REST| User

%% RabbitMQ connections
   Doc -->|Publish| RabbitMQ
   Org -->|Publish| RabbitMQ
   Email -->|Consume| RabbitMQ
   Doc -->|Consume| RabbitMQ

%% Python services
   RabbitMQ -->|Celery| Embed
   Embed --- Chat
   Chat --- Generate

%% Styling with high contrast colors
   classDef service fill:#e1d5e7,stroke:#000,stroke-width:2px,color:#000;
   classDef database fill:#000,stroke:#fff,stroke-width:2px,color:#fff;
   classDef messagebroker fill:#6a1b9a,stroke:#000,stroke-width:2px,color:#fff;
   classDef gateway fill:#9673a6,stroke:#000,stroke-width:2px,color:#fff;
   classDef client fill:#fff,stroke:#000,stroke-width:2px,color:#000;
   classDef pythonservice fill:#4a148c,stroke:#000,stroke-width:2px,color:#fff;

   class Auth,User,Org,Doc,Email service;
   class Chat,Embed,Generate pythonservice;
   class AuthDB,UserDB,OrgDB,DocDB,VectorDB database;
   class RabbitMQ messagebroker;
   class Gateway,Registry,Config gateway;
   class Client client;
```

## Communication Methods

1. **REST API**:
   - API Gateway routes external requests to microservices
   - Service-to-service synchronous communication (e.g., Document Service calling User Service)

2. **RabbitMQ Messaging**:
   - Asynchronous communication between services
   - Event-driven architecture (e.g., Space deletion triggering document deletion)
   - Integration with Python services via Celery

3. **Service Discovery**:
   - Services register with Registry Service
   - Enables dynamic service location

4. **Configuration**:
   - Centralized configuration via Config Service

## Databases

1. **PostgreSQL**:
   - Auth Service: User authentication and authorization data
   - User Service: User profiles and related data
   - Organization Service: Organizations, teams, and spaces data

2. **MongoDB**:
   - Document Service: Document storage and metadata

3. **ChromaDB**:
   - Vector database for document embeddings used by the Chat Service

## Data Flow Examples

1. **Document Creation**:
   - Client creates document via API Gateway
   - Document Service stores document in MongoDB
   - Document Service publishes message to RabbitMQ
   - Embed Service consumes message and creates vector embeddings in ChromaDB

2. **Space Deletion**:
   - Client deletes space via API Gateway
   - Organization Service processes deletion
   - Organization Service publishes DOCUMENT_DELETE message to RabbitMQ
   - Document Service consumes message and deletes associated documents