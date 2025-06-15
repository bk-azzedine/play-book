CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE users (
                             user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                             first_name VARCHAR(255),
                             last_name VARCHAR(255),
                             email VARCHAR(255) UNIQUE,
                             password VARCHAR(255)
);