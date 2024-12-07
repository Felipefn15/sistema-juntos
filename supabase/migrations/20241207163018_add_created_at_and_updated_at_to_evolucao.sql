-- Add created_at and updated_at columns
ALTER TABLE evolucao
  ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create a trigger to update `updated_at` on row modification
CREATE OR REPLACE FUNCTION update_evolucao_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON evolucao
FOR EACH ROW
EXECUTE FUNCTION update_evolucao_updated_at();
