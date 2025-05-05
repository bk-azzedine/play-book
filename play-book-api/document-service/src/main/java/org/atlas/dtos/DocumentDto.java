package org.atlas.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDto {

    private String id;


    private String title;

    private String description;


    private ContentDto content;

    private String organization;

    private String space;

    private List<UserDto> authors = new ArrayList<>();


    private List<String> tags = new ArrayList<>();


    private boolean isDraft;


    private LocalDateTime createdAt;


    private LocalDateTime lastUpdated;


}
