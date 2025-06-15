package org.atlas.messages;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class DocumentMessage {
    String id;
    String title;
    String description;
    String content;
    String organization;
    String space;
    String[] authors;
    String[] tags;

}
