package org.atlas.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.atlas.enums.TeamRole;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table(name = "team_members")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeamMembers {
    @Id
    private UUID id;
    @Column("team_id")
    private UUID teamId;
    @Column("user_id")
    private UUID userId;

    private TeamRole role;


}
