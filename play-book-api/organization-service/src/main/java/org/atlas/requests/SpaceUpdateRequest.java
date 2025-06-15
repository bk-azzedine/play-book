package org.atlas.requests;

import lombok.Data;
import org.atlas.enums.SpaceVisibility;
import org.springframework.data.relational.core.mapping.Column;

import java.util.UUID;
@Data
public class SpaceUpdateRequest {
    private UUID space_id;
    private String name;
    private String description;
    private String icon;
    private UUID teamId;
    private SpaceVisibility visibility;
}
