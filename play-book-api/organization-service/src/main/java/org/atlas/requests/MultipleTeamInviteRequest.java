package org.atlas.requests;

import java.util.List;
import java.util.UUID;

public record MultipleTeamInviteRequest(List<String> emails, UUID teamId, String role) {
}
