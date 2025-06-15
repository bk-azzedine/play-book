alter table token
add COLUMN IF NOT EXISTS tokenFingerprint varchar(255) DEFAULT NULL,
add column if not exists jti varchar(255) DEFAULT NULL,
add column if not exists previousTokenId uuid DEFAULT NULL