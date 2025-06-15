package org.atlas.enums;

public enum CodeType {
    ACTIVATION("activation"),
    FORGOT_PASSWORD("forgot_password"),
    TWO_FACTOR_AUTHENTICATION("two_factor_authentication");

    private final String type;

    CodeType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
