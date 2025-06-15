package org.atlas.responses;

import org.atlas.dtos.UserDto;


public record SignInResponse(String accessToken, String refreshToken, UserDto user) {
}