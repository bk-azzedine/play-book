package org.atlas.enums;

import lombok.Data;
import lombok.Getter;

@Getter
public enum Template {

    TEAM_INVITE("team_invite"),
    ACTIVATION_CODE("activate_account"),
    FORGOT_PASSWORD("forgot_password");
    private final String value;

    Template(String value) {
        this.value = value;
    }
}
