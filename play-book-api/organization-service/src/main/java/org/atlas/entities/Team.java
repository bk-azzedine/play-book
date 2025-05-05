package org.atlas.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table(name = "teams")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Team {
    @Id
    private UUID team_id;
    private String name;
    @Column("organization_id")
    private UUID organizationId;

}
