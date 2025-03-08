package org.atlas.requests;
import jakarta.validation.constraints.NotNull;

public record SignUpRequest(String firstName, String lastName , @NotNull String email, @NotNull String password){

}

