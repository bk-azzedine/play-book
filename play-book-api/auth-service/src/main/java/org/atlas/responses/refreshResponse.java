package org.atlas.responses;

import org.atlas.dtos.UserDto;

public record refreshResponse(String accessToken, UserDto user) {
}
