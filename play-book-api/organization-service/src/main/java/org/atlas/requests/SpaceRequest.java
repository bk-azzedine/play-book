package org.atlas.requests;

import org.atlas.enums.SpaceVisibility;

import java.util.List;
import java.util.UUID;

public record SpaceRequest(String name, String description, String icon, UUID team_id, SpaceVisibility visibility, List<SpaceMemberRequest> members  ) {
}
