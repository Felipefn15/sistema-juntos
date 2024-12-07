-- Add the new column `responsavel` to the Paciente table
ALTER TABLE Paciente ADD COLUMN responsavel VARCHAR(255);

-- Step 1: Remove the existing `idade` column
ALTER TABLE Paciente DROP COLUMN IF EXISTS idade;

-- Step 2: Add the new `data_nascimento` column
ALTER TABLE Paciente ADD COLUMN data_nascimento DATE;