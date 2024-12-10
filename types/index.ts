import { Event } from "react-big-calendar";

export interface Pagamento {
  id: string;
  descricao: string;
  valor: number;
  pago: boolean;
}

export interface Paciente {
  id: string;
  nome: string;
  contato: string;
  responsavel: string;
  data_nascimento: string; // Use ISO string format for date
}

export interface Psicologa {
  id: string;
  nome: string;
  email: string;
  contato: string;
  documento: string;
}

export interface Agendamento extends Event {
  id: string;
  start_date: string; // Use ISO string format for date
  end_date: string;   // Use ISO string format for date
  paciente_id: string;
  psicologa_id: string;
  paciente?: Paciente;
  pagamento?: Pagamento[];
  psicologa?: Psicologa;
}

export interface Evolucao {
  id: string;                // The unique identifier for the evolution record (assuming it's an UUID or string)
  agendamento_id: string;     // The event related to the evolution
  descricao: string;
  created_at: string;        // Timestamp when the record was created
  updated_at: string;        // Timestamp when the record was last updated
  agendamento: Agendamento
}