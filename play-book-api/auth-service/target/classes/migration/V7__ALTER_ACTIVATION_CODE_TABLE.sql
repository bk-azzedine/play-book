
ALTER TABLE activation_code RENAME TO codes;


ALTER TABLE codes
    ADD COLUMN IF NOT EXISTS code_type varchar(50) DEFAULT NULL;