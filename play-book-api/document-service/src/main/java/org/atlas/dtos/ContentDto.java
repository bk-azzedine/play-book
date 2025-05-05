package org.atlas.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContentDto {
    private Long time;
    private List<BlockDto> blocks;
    private String version;
}
