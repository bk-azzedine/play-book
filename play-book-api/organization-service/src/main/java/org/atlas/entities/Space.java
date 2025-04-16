package org.atlas.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
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
    private UUID team_id;

}
