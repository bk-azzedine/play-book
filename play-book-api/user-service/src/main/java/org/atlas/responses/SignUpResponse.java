package org.atlas.responses;

import org.atlas.dtos.UserDto;

public record SignUpResponse(UserDto user, String token)  {
}
