package org.atlas.dtos;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.UUID;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpaceDto {
    UUID spaceId;
    String name;
    String description;
    String icon;
    String teamId;
    List<SpaceMembersDto> members;
    List<DocumentDto> documents;
}
