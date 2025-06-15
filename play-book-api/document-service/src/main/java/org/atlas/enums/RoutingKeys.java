package org.atlas.enums;

import lombok.Getter;

@Getter
public enum RoutingKeys {
    DOCUMENT_VECTORIZE("document.vectorize");



    private final String value;

    RoutingKeys(String value) {
        this.value = value;
    }

}