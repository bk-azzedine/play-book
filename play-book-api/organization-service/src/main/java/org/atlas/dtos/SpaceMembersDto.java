package org.atlas.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.atlas.enums.SpacePrivileges;
import org.springframework.data.relational.core.mapping.Column;

import java.util.UUID;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpaceMembersDto {
    private UUID id;
    private UUID spaceId;
    private UserDto user;
    private SpacePrivileges privilege;
}
