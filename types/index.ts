import { Event } from "react-big-calendar";

export interface Pagamento {
  id: string; // Unique ID of the payment
  descricao: string; // Description of the payment
  valor: number; // Amount of the payment
  pago: boolean; // Indicates if the payment is completed
  agendamento_id: string; // ID of the associated appointment
}

export interface Appointment extends Event {
  id: string;
  start_date: Date; // Start date of the appointment
  end_date: Date; // End date of the appointment
  paciente_id: string; // ID of the associated patient
  psicologa_id: string; // ID of the associated psychologist
  paid?: boolean; // Optional: Overall payment status
  pagamento?: Pagamento[]; // Optional: List of payments associated with the appointment
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