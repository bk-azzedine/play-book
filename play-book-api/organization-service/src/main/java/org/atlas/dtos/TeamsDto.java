package org.atlas.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.atlas.entities.TeamMembers;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeamsDto {
    UUID teamId;
    String name;
    List<SpaceDto> spaces;
    List<TeamMembersDto> members;
}
