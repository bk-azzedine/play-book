create table spaces (
    space_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(250),
    description VARCHAR(250),
    icon VARCHAR(250),
    team_id UUID NOT NULL,
    FOREIGN KEY (team_id) references TEAMS (TEAM_ID)
)