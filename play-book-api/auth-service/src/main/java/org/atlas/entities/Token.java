package org.atlas.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.atlas.enums.TokenType;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Table("token")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Token {
    @Id
    @Column("tokenId")
    private UUID tokenId;
    private String token;
    private LocalDateTime expires;
    @Column("token_type")
    private String tokenType;
    @Column("userId")
    private UUID userId;
    private boolean is_valid;

}
