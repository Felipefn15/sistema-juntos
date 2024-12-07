-- Rename data and hora columns to start_date and end_date as datetime
ALTER TABLE agendamento
  DROP COLUMN data,
  DROP COLUMN hora,
  ADD COLUMN start_date timestamp,
  ADD COLUMN end_date timestamp;