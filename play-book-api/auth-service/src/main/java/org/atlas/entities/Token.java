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

    /**
     * Stores a hash of the token instead of the full token for security
     */
    @Column("tokenfingerprint")
    private String tokenFingerprint;

    /**
     * JWT ID claim for token revocation support
     */
    private String jti;

    /**
     * Reference to previous token for implementing token rotation
     */
    @Column("previoustokenid")
    private UUID previousTokenId;
    private LocalDateTime expires;
    @Column("token_type")
    private String tokenType;
    @Column("userId")
    private UUID userId;
    private boolean is_valid;
}
