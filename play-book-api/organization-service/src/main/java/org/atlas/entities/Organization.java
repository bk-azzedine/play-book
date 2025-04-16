package org.atlas.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.atlas.enums.OrganizationField;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table(name = "organizations")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Organization {

    @Id
    @Column("organization_id")
    private UUID organizationId;
    @Column("owner_id")
    private UUID ownerId;
    private String name;

    private String field;


}
