import { Event } from "react-big-calendar";

export interface Appointment extends Event {
    id: string;
    start_date: Date;
    end_date: Date;
    paciente_id: string;
    psicologa_id: string;
    checked: boolean;
  }

export interface Patient {
  id: string;
  nome: string;
  contato: string;
  data_nascimento: string;
  responsavel: string
}

export interface AppointmentWithPatient extends Appointment{
  Patient?: Patient
}

export interface Evolucao {
  id: string;                // The unique identifier for the evolution record (assuming it's an UUID or string)
  agendamento_id: string;     // The event related to the evolution
  descricao: string;
  created_at: string;        // Timestamp when the record was created
  updated_at: string;        // Timestamp when the record was last updated
}