package org.atlas.requests;

import java.util.List;
import java.util.UUID;

public record SpaceRequest(String name, String description, String icon, UUID team_id, List<UUID> owners) {
}
