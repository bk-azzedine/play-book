package org.atlas.responses;

import java.util.UUID;

public record Claims<E extends Enum<E>>(UUID id, Enum<E> claim) {
}
