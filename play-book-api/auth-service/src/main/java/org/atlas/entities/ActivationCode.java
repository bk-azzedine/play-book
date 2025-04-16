package org.atlas.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Table("activation_code")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivationCode {

    @Id
    private UUID id;
    private String code;
    private UUID userId;
    private LocalDateTime expiredAt;
    private LocalDateTime createdAt;
    private boolean used;
}
