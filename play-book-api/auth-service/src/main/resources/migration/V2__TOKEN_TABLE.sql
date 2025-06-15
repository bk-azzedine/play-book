create table token (
    tokenId uuid primary key default uuid_generate_v4(),
    token varchar,
    expires timestamp,
    userId uuid

)
