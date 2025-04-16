package org.atlas.requests;

import java.util.UUID;

public record TeamRequest(String teamName, UUID organizationId) {
}
