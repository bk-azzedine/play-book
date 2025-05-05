package org.atlas.services;

import org.atlas.dtos.SpaceDto;
import org.atlas.dtos.SpaceMembersDto;
import org.atlas.entities.Space;
import org.atlas.entities.SpaceMembers;
import org.atlas.enums.SpacePrivileges;
import org.atlas.interfaces.SpaceServiceInterface;
import org.atlas.repositories.SpaceMembersRepository;
import org.atlas.repositories.SpaceRepository;
import org.atlas.requests.SpaceRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SpaceService implements SpaceServiceInterface {
    private final SpaceMembersRepository spaceMembersRepository;
    private final SpaceRepository spaceRepository;
    private final ModelMapper modelMapper;
    @Autowired
    public SpaceService(SpaceMembersRepository spaceMembersRepository, SpaceRepository spaceRepository, ModelMapper modelMapper) {
        this.spaceMembersRepository = spaceMembersRepository;
        this.spaceRepository = spaceRepository;
        this.modelMapper = modelMapper;
    }


    @Override
    public Mono<Space> createSpace(SpaceRequest spaceRequest) {

        Space space = Space.builder()
                .name(spaceRequest.name())
                .icon(spaceRequest.icon())
                .teamId(spaceRequest.team_id())
                .build();

        return spaceRepository.save(space)
                .flatMap(savedSpace -> {
                    List<SpaceMembers> spaceMembers = spaceRequest.owners().stream()
                            .map(owner -> SpaceMembers.builder()
                                    .spaceId(savedSpace.getSpace_id())
                                    .userId(owner)
                                    .privilege(SpacePrivileges.CAN_EDIT)
                                    .build())
                            .collect(Collectors.toList());
                    return spaceMembersRepository.saveAll(spaceMembers)
                            .collectList()
                            .thenReturn(savedSpace);
                });
    }

    @Override
    public Flux<SpaceDto> getSpaces(UUID teamId) {
        return spaceRepository.findAllByTeamId(teamId)
                .flatMap(space ->
                        spaceMembersRepository.findAllBySpaceId(space.getSpace_id())
                                .map(member -> modelMapper.map(member, SpaceMembersDto.class))
                                .collectList()
                                .map(members -> new SpaceDto(
                                        space.getSpace_id(),
                                        space.getName(),
                                        space.getDescription(),
                                        space.getIcon(),
                                        members,
                                        List.of() // Documents not loaded here
                                ))
                );
    }



}
