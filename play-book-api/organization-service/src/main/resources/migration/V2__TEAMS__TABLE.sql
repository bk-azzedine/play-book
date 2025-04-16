create table teams (
    team_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(250),
    organization_id UUID NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES ORGANIZATIONS (ORGANIZATION_ID)
);