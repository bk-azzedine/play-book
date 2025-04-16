package org.atlas.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.atlas.enums.SpacePrivileges;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table(name = "space_members")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpaceMembers {
    @Id
    private UUID id;
    @Column("space_id")
    private UUID spaceId;
    @Column("user_id")
    private UUID userId;

    private SpacePrivileges privilege;
}
