
create TABLE IF NOT EXISTS space_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID NOT NULL,
    user_id UUID NOT NULL,
    privilege varchar,
    FOREIGN KEY (space_id) REFERENCES SPACES (space_id)

)