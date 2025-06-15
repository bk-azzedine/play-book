package org.atlas.requests;

import java.util.UUID;

public record MemberRequest(UUID userId,
                            String firstName,
                            String lastName,
                            String email
) {
}
