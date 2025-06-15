package org.atlas.enums;

import lombok.Getter;

@Getter
public enum RoutingKeys {
    TEAM_INVITE("email.team.invite"),
    DOCUMENT_DELETE("document.delete");

    private final String value;

    RoutingKeys(String value) {
        this.value = value;
    }

}