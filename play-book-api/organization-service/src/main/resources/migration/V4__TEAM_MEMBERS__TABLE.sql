
create table team_members (
    id UUID PRIMARY KEY DEFAULT  uuid_generate_v4(),
    user_id UUID NOT NULL,
    team_id UUID NOT NULL,
    role varchar,
    FOREIGN KEY (team_id) REFERENCES TEAMS (team_id)


);