package org.atlas.enums;

import lombok.Getter;

@Getter
public enum RoutingKeys {
    TEAM_INVITE("email.team.invite");

    private final String value;

    RoutingKeys(String value) {
        this.value = value;
    }

}