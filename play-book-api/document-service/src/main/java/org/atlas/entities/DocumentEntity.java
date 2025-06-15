package org.atlas.entities;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document("document" )
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DocumentEntity {

    @Id
    private String id;

    @TextIndexed
    private String title;

    @TextIndexed
    private String description;


    private Content content;

    @Indexed
    private String organization;

    @Indexed
    private String space;

    private List<String> authors = new ArrayList<>();

    @Indexed
    private List<String> tags = new ArrayList<>();

    @Indexed
    private boolean draft ;

    @Indexed
    private boolean favorite;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime lastUpdated;




}
