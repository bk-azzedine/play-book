package org.atlas.enums;

import lombok.Data;
import lombok.Getter;

@Getter
public enum Template {

    TEAM_INVITE("team_invite"),
    ACTIVATION_CODE("activate_account");
    private final String value;

    Template(String value) {
        this.value = value;
    }
}
