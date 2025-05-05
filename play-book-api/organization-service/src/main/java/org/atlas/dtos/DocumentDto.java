package org.atlas.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentDto {

    private String id;
    private String title;
    private String description;
    private ContentDto content;
    private String organization;


    private List<String> authors ;


    private List<String> tags;
    private boolean isDraft;
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdated;
}
