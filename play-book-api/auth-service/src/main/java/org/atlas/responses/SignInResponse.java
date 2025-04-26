package org.atlas.responses;

import lombok.Builder;
import lombok.Data;


public record SignInResponse(String accessToken, String refreshToken) {
}