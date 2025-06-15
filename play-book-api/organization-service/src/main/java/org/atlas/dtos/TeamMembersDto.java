package org.atlas.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.atlas.enums.TeamRole;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeamMembersDto {

    private UUID id;

    private UUID teamId;

    private UserDto user;

    private TeamRole role;


}
