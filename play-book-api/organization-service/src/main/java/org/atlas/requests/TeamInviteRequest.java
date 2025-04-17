package org.atlas.requests;

import java.util.UUID;

public record TeamInviteRequest(String email, UUID teamId) {
}
