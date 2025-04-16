package org.atlas.enums;

import lombok.Data;
import lombok.Getter;

@Getter
public enum Template {
    ACTIVATION_CODE("activate_account");
    private final String value;

    Template(String activateAccount) {
        this.value = activateAccount;
    }
}
