package org.atlas.services;

import org.atlas.dtos.SpaceDto;
import org.atlas.dtos.SpaceMembersDto;
import org.atlas.dtos.UserDto;
import org.atlas.entities.Space;
import org.atlas.entities.SpaceMembers;
import org.atlas.enums.RoutingKeys;
import org.atlas.enums.SpacePrivileges;
import org.atlas.exceptions.Exception;
import org.atlas.exceptions.ExceptionHandler;
import org.atlas.interfaces.OrganizationPublishServiceInterface;
import org.atlas.interfaces.SpaceServiceInterface;
import org.atlas.interfaces.UserServiceInterface;
import org.atlas.repositories.SpaceMembersRepository;
import org.atlas.repositories.SpaceRepository;
import org.atlas.requests.SpaceRequest;
import org.atlas.requests.SpaceUpdateRequest;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.atlas.exceptions.Exceptions.EXCEPTION_02;
import static org.atlas.exceptions.Exceptions.EXCEPTION_03;

@Service
public class SpaceService implements SpaceServiceInterface {
    private final SpaceMembersRepository spaceMembersRepository;
    private final SpaceRepository spaceRepository;
    private final ModelMapper modelMapper;
    private final UserServiceInterface userService;
    private final OrganizationPublishServiceInterface organizationPublishService;

    final Logger logger =
            LoggerFactory.getLogger(SpaceService.class);


    @Autowired
    public SpaceService(SpaceMembersRepository spaceMembersRepository, SpaceRepository spaceRepository, ModelMapper modelMapper, UserService userService, OrganizationPublishServiceInterface organizationPublishService) {
        this.spaceMembersRepository = spaceMembersRepository;
        this.spaceRepository = spaceRepository;
        this.modelMapper = modelMapper;
        this.userService = userService;
        this.organizationPublishService = organizationPublishService;
    }


    @Override
    public Mono<SpaceDto> createSpace(SpaceRequest spaceRequest) {

        Space space = Space.builder()
                .name(spaceRequest.name())
                .icon(spaceRequest.icon())
                .description(spaceRequest.description())
                .visibility(spaceRequest.visibility())
                .teamId(spaceRequest.team_id())
                .build();

        return spaceRepository.save(space)
                .flatMap(savedSpace -> {
                    List<SpaceMembers> spaceMembers = spaceRequest.members().stream()
                            .map(member -> SpaceMembers.builder()
                                    .spaceId(savedSpace.getSpace_id())
                                    .userId(member.member().userId())
                                    .privilege(SpacePrivileges.CAN_EDIT)
                                    .build())
                            .collect(Collectors.toList());
                    return spaceMembersRepository.saveAll(spaceMembers)
                            .collectList()
                            .thenReturn(modelMapper.map(space, SpaceDto.class));
                });
    }

    @Override
    public Mono<SpaceDto> updateSpace(SpaceUpdateRequest spaceUpdateRequest) {
        logger.info("Attempting to update space with ID: {}", spaceUpdateRequest.getSpace_id());
        return spaceRepository.findById(spaceUpdateRequest.getSpace_id())
                .flatMap(existingSpace -> {
                    logger.debug("Found existing space: {}", existingSpace.getSpace_id());
                    existingSpace.setName(spaceUpdateRequest.getName());
                    existingSpace.setDescription(spaceUpdateRequest.getDescription());
                    existingSpace.setIcon(spaceUpdateRequest.getIcon());
                    existingSpace.setVisibility(spaceUpdateRequest.getVisibility());
                    existingSpace.setTeamId(spaceUpdateRequest.getTeamId());

                    logger.info("Updating space fields for ID: {}", existingSpace.getSpace_id());
                    return spaceRepository.save(existingSpace)
                            .flatMap(savedSpace -> {
                                logger.info("Space with ID: {} updated successfully.", savedSpace.getSpace_id());
                                return Mono.just(modelMapper.map(savedSpace, SpaceDto.class));
                            })
                            .doOnError(e -> logger.error("Failed to save space with ID: {}. Error: {}", existingSpace.getSpace_id(), e.getMessage(), e));
                })
                .switchIfEmpty(Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_03))));
    }

    @Override
    public Mono<String> deleteSpace(UUID spaceId) {
        return spaceRepository.findById(spaceId)
                .flatMap(space -> {
                    HashMap<String, Object> map = new HashMap<>();
                    map.put("messageType", RoutingKeys.DOCUMENT_DELETE);
                    map.put("spaceId", spaceId);


                    logger.info("Publishing delete space documents space: {}",
                            space.getName());

                    organizationPublishService.publishMessage("data-exchange",
                            RoutingKeys.DOCUMENT_DELETE.getValue(), map);
                    logger.info("Attempting to delete space with ID: {}", spaceId);

                    // First delete all space members
                    return spaceMembersRepository.deleteAllBySpaceId(spaceId)
                            .then(Mono.defer(() -> {
                                logger.info("Space members deleted for space ID: {}", spaceId);

                                // Then delete the space itself
                                return spaceRepository.deleteById(spaceId)
                                        .then(Mono.just("Space deleted successfully"));
                            }))
                            .doOnError(e -> logger.error("Failed to delete space or space members for space ID: {}. Error: {}", spaceId, e.getMessage(), e));
                })
                .switchIfEmpty(Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_03))));
    }

    @Override
    public Flux<SpaceDto> getSpaces(UUID teamId) {
        return spaceRepository.findAllByTeamId(teamId)
                .flatMap(space -> {


                    Mono<List<SpaceMembersDto>> membersMono = spaceMembersRepository.findAllBySpaceId(space.getSpace_id())
                            .map(member -> {
                                SpaceMembersDto memberDto = modelMapper.map(member, SpaceMembersDto.class);
                                UserDto userDto = new UserDto();
                                userDto.setUserId(member.getUserId());
                                memberDto.setUser(userDto);
                                return memberDto;
                            })
                            .collectList();

                    // Get user IDs from space members
                    Mono<List<UUID>> userIdsMono = spaceMembersRepository.findAllBySpaceId(space.getSpace_id())
                            .map(SpaceMembers::getUserId)
                            .collectList();

                    // Combine all operations
                    return Mono.zip( membersMono, userIdsMono)
                            .flatMap(tuple -> {
                                List<SpaceMembersDto> members = tuple.getT1();
                                List<UUID> membersIds = tuple.getT2();


                                // If there are no members, return the space directly
                                if (membersIds.isEmpty()) {
                                    return Mono.just(new SpaceDto(
                                            space.getSpace_id(),
                                            space.getName(),
                                            space.getDescription(),
                                            space.getIcon(),
                                            space.getTeamId().toString(),
                                            members,
                                            null
                                    ));
                                }

                                // Fetch all user details at once
                                return userService.getOrgMembers(membersIds)
                                        .collectMap(UserDto::getUserId)
                                        .map(userMap -> {
                                            // Populate user details in space members
                                            members.forEach(member -> {
                                                UUID userId = member.getUser().getUserId();
                                                if (userMap.containsKey(userId)) {
                                                    member.setUser(userMap.get(userId));
                                                }
                                            });

                                            return new SpaceDto(
                                                    space.getSpace_id(),
                                                    space.getName(),
                                                    space.getDescription(),
                                                    space.getIcon(),
                                                    space.getTeamId().toString(),
                                                    members,
                                                    null);
                                        });
                            });
                });
    }



}
