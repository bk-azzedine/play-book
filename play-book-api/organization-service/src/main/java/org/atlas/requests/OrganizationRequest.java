package org.atlas.requests;

import org.atlas.enums.OrganizationField;

public record OrganizationRequest(String name, OrganizationField field) {
}
