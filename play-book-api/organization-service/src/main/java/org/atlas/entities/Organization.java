package org.atlas.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.atlas.enums.OrganizationField;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table(name = "organizations")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Organization {

    @Id
    private UUID id;
    private String name;
    private Enum<OrganizationField> field;


}
