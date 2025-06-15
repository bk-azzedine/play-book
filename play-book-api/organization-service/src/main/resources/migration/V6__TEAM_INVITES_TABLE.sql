create TABLE IF NOT EXISTS team_invites (
    inviteId UUID primary key default uuid_generate_v4(),
    email varchar,
    created timestamp,
    expires timestamp,
    status varchar,
    teamId UUID
)