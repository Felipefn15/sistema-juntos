-- Migration: update_psicologa_table


-- Remove 'senha' column, as it is no longer part of the new model
ALTER TABLE psicologa
  DROP COLUMN senha;

-- Add 'email', 'image', and 'google_id' columns
ALTER TABLE psicologa
  ADD COLUMN email varchar(255) UNIQUE NOT NULL,
  ADD COLUMN image varchar(255),
  ADD COLUMN google_id varchar(255) UNIQUE NOT NULL;

-- Add 'created_at' and 'updated_at' timestamp columns
ALTER TABLE psicologa
  ADD COLUMN created_at timestamp with time zone default now(),
  ADD COLUMN updated_at timestamp with time zone default now();

