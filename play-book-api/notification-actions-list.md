# Notification-Worthy Actions in Play-Book API

This document lists all the actions within the Play-Book API project that should generate notifications. These actions are organized by service/domain and include details about the source code location, actors, recipients, and existing messaging infrastructure.

## 1. User Service

### 1.1. User Registration
- **Source**: `UserService.registerUser()` in `user-service/src/main/java/org/atlas/services/UserService.java`
- **Description**: When a new user registers for an account
- **Actor**: The user registering
- **Recipients**: The user themselves
- **Existing Messaging**: Publishes a message with type "ACTIVATION_CODE" to RabbitMQ with routing key `USER_ACTIVATE_ACCOUNT`
- **Notification Content**: "Your account has been created. Please check your email to activate your account."
- **Priority**: High

### 1.2. User Registration with Invite
- **Source**: `UserService.registerUserWithInvite()` in `user-service/src/main/java/org/atlas/services/UserService.java`
- **Description**: When a user registers via a team invitation
- **Actor**: The user registering
- **Recipients**: The user themselves and the team admin who sent the invite
- **Existing Messaging**: Publishes a message with type "ACTIVATION_CODE" to RabbitMQ with routing key `USER_ACTIVATE_ACCOUNT`
- **Notification Content**: 
  - To user: "Your account has been created and you've been added to [team name]. Please check your email to activate your account."
  - To team admin: "[User name] has accepted your invitation to join [team name]."
- **Priority**: High

### 1.3. User Account Validation
- **Source**: `UserService.validateUser()` in `user-service/src/main/java/org/atlas/services/UserService.java`
- **Description**: When a user activates their account
- **Actor**: The user activating their account
- **Recipients**: The user themselves
- **Existing Messaging**: None directly, but could leverage the user validation process
- **Notification Content**: "Your account has been successfully activated. Welcome to Play-Book!"
- **Priority**: Medium

### 1.4. Password Update
- **Source**: `UserService.updatePassword()` in `user-service/src/main/java/org/atlas/services/UserService.java`
- **Description**: When a user updates their password
- **Actor**: The user updating their password
- **Recipients**: The user themselves
- **Existing Messaging**: None directly
- **Notification Content**: "Your password has been successfully updated."
- **Priority**: High (security-related)

## 2. Organization Service

### 2.1. Team Invitation
- **Source**: `TeamService.inviteToTeam()` in `organization-service/src/main/java/org/atlas/services/TeamService.java`
- **Description**: When a user is invited to join a team
- **Actor**: The team admin sending the invitation
- **Recipients**: The invited user
- **Existing Messaging**: Publishes a message with type "TEAM_INVITE" to RabbitMQ with routing key `TEAM_INVITE`
- **Notification Content**: "You've been invited to join [team name] at [organization name] as [role]."
- **Priority**: Medium

### 2.2. Multiple Team Invitations
- **Source**: `TeamService.inviteMultipleToTeam()` in `organization-service/src/main/java/org/atlas/services/TeamService.java`
- **Description**: When multiple users are invited to join a team
- **Actor**: The team admin sending the invitations
- **Recipients**: The invited users
- **Existing Messaging**: Uses the same mechanism as single team invites
- **Notification Content**: "You've been invited to join [team name] at [organization name] as [role]."
- **Priority**: Medium

### 2.3. Team Invite Declined
- **Source**: `TeamService.DeclineInvite()` in `organization-service/src/main/java/org/atlas/services/TeamService.java`
- **Description**: When a user declines a team invitation
- **Actor**: The user declining the invitation
- **Recipients**: The team admin who sent the invite
- **Existing Messaging**: None directly
- **Notification Content**: "[User name] has declined your invitation to join [team name]."
- **Priority**: Low

### 2.4. User Added to Team
- **Source**: `TeamService.addUserToTeam()` in `organization-service/src/main/java/org/atlas/services/TeamService.java`
- **Description**: When a user accepts a team invitation and is added to the team
- **Actor**: The user accepting the invitation
- **Recipients**: The team admin and all team members
- **Existing Messaging**: None directly
- **Notification Content**: 
  - To team admin: "[User name] has joined [team name]."
  - To team members: "[User name] has joined your team."
- **Priority**: Medium

### 2.5. Space Deletion
- **Source**: `SpaceService.deleteSpace()` in `organization-service/src/main/java/org/atlas/services/SpaceService.java`
- **Description**: When a space is deleted
- **Actor**: The user (likely an admin) deleting the space
- **Recipients**: All members of the team that owned the space
- **Existing Messaging**: Publishes a message with type "DOCUMENT_DELETE" to RabbitMQ with routing key `DOCUMENT_DELETE`
- **Notification Content**: "The space [space name] has been deleted along with all its documents."
- **Priority**: High (data loss event)

## 3. Document Service

### 3.1. Document Creation/Update
- **Source**: `DocumentService.save()` in `document-service/src/main/java/org/atlas/services/DocumentService.java`
- **Description**: When a document is created or updated
- **Actor**: The user creating or updating the document
- **Recipients**: All authors of the document and team members with access
- **Existing Messaging**: Publishes a message to RabbitMQ with routing key `DOCUMENT_VECTORIZE`
- **Notification Content**: 
  - For creation: "[User name] created a new document: [document title]"
  - For update: "[User name] updated the document: [document title]"
- **Priority**: Medium

## 4. Auth Service

### 4.1. Activation Code Resend
- **Source**: `CodeService.resendCode()` in `auth-service/src/main/java/org/atlas/services/CodeService.java`
- **Description**: When a user requests a new activation code
- **Actor**: The user requesting the code
- **Recipients**: The user themselves
- **Existing Messaging**: Publishes a message with type "ACTIVATION_CODE" to RabbitMQ with routing key `AUTH_ACTIVATE_ACCOUNT`
- **Notification Content**: "A new activation code has been sent to your email."
- **Priority**: Medium

### 4.2. Password Reset Request
- **Source**: `CodeService.forgotPassword()` in `auth-service/src/main/java/org/atlas/services/CodeService.java`
- **Description**: When a user requests a password reset
- **Actor**: The user requesting the reset
- **Recipients**: The user themselves
- **Existing Messaging**: Publishes a message with type "FORGOT_PASSWORD" to RabbitMQ with routing key `AUTH_RESET_PASSWORD`
- **Notification Content**: "A password reset code has been sent to your email."
- **Priority**: High (security-related)

### 4.3. Password Reset Completion
- **Source**: `CodeService.validateReset()` in `auth-service/src/main/java/org/atlas/services/CodeService.java`
- **Description**: When a user successfully resets their password
- **Actor**: The user resetting their password
- **Recipients**: The user themselves
- **Existing Messaging**: None directly
- **Notification Content**: "Your password has been successfully reset."
- **Priority**: High (security-related)

## 5. Email Service

The Email Service doesn't generate notifications itself but processes messages from other services to send emails. The same events that trigger emails could also trigger in-app notifications:

### 5.1. Account Activation Email
- **Source**: `Listener.handleActivationCode()` in `email-service/src/main/java/org/atlas/listners/Listener.java`
- **Description**: When an activation code email is sent
- **Existing Messaging**: Processes "ACTIVATION_CODE" messages

### 5.2. Team Invitation Email
- **Source**: `Listener.handleTeamInvite()` in `email-service/src/main/java/org/atlas/listners/Listener.java`
- **Description**: When a team invitation email is sent
- **Existing Messaging**: Processes "TEAM_INVITE" messages

### 5.3. Password Reset Email
- **Source**: `Listener.handleForgotPassword()` in `email-service/src/main/java/org/atlas/listners/Listener.java`
- **Description**: When a password reset email is sent
- **Existing Messaging**: Processes "FORGOT_PASSWORD" messages

## 6. Additional Notification-Worthy Actions (Not Currently Implemented)

These actions are not currently sending messages but would be valuable to notify users about:

### 6.1. Document Comment
- **Description**: When a user comments on a document
- **Actor**: The user adding the comment
- **Recipients**: Document authors and users mentioned in the comment
- **Notification Content**: "[User name] commented on [document title]: [comment preview]"
- **Priority**: Medium

### 6.2. User Mention
- **Description**: When a user is mentioned in a document or comment
- **Actor**: The user creating the mention
- **Recipients**: The mentioned user
- **Notification Content**: "[User name] mentioned you in [document title]"
- **Priority**: Medium

### 6.3. Document Share
- **Description**: When a document is shared with a user
- **Actor**: The user sharing the document
- **Recipients**: Users the document is shared with
- **Notification Content**: "[User name] shared a document with you: [document title]"
- **Priority**: Medium

### 6.4. Team Role Change
- **Description**: When a user's role in a team is changed
- **Actor**: The team admin changing the role
- **Recipients**: The user whose role changed
- **Notification Content**: "Your role in [team name] has been changed to [new role]."
- **Priority**: Medium

### 6.5. Organization Membership Change
- **Description**: When a user's organization membership changes
- **Actor**: The organization admin
- **Recipients**: The affected user
- **Notification Content**: "Your membership in [organization name] has been [changed/removed]."
- **Priority**: High