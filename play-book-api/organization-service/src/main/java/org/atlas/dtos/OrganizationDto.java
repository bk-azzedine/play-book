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
public class OrganizationDto {
    UUID organizationId;
    String name;
    String field;
    private UserDto owner;
    List<TeamsDto> teams;
    private String initial;
    private String color;
}
