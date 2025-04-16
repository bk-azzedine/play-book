package org.atlas.enums;

import lombok.Getter;

@Getter
public enum RoutingKeys {
    USER_ACTIVATE_ACCOUNT("email.user.activate-account"),
    USER_RESET_PASSWORD("email.user.reset-password");


    private final String value;

    RoutingKeys(String value) {
        this.value = value;
    }

}