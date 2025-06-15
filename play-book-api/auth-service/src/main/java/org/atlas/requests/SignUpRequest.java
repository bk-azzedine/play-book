package org.atlas.requests;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

public record SignUpRequest(String name, String username, String password) {
}
