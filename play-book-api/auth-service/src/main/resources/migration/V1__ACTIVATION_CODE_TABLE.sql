CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
create table activation_code (
        id uuid primary key default uuid_generate_v4(),
        code varchar(8),
        user_id uuid,
        expired_at timestamp,
        created_at timestamp,
        used boolean
)