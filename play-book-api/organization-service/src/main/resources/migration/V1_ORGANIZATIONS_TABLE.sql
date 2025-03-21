CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TYPE field_type AS ENUM ('tech', 'law', 'marketing');

CREATE TABLE organizations (
                               organization_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                               name VARCHAR(255),
                               field field_type
);