
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE organizations (
                               organization_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                               owner_id UUID,
                               name VARCHAR(255),
                               field varchar(20)
);
