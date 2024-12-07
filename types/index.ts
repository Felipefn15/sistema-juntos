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
  data_nascimento: Date;
  responsavel: string
}

export interface AppointmentWithPatient extends Appointment{
  Patient?: Patient
}