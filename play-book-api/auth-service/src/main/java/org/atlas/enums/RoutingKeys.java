package org.atlas.enums;

public enum RoutingKeys {
    AUTH_ACTIVATE_ACCOUNT("email.auth.activate-account"),
    AUTH_RESET_PASSWORD("email.auth.reset-password");


    private final String value;

    RoutingKeys(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}