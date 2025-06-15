package org.atlas.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.atlas.enums.SpaceVisibility;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table(name = "spaces")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Space {
    @Id
    private UUID space_id;
    private String name;
    private String description;
    private String icon;
    @Column("team_id")
    private UUID teamId;
    private SpaceVisibility visibility;

}
