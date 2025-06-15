package org.atlas.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.atlas.enums.InviteStatus;
import org.atlas.enums.TeamRole;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Table(name = "team_invites")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeamInvites {
    @Id
    @Column("inviteId")
    private UUID inviteId;
    private String email;
    private LocalDateTime created;
    private LocalDateTime expires;
    private InviteStatus status;
    @Column("teamId")
    private UUID teamId;
    private TeamRole role;
}
