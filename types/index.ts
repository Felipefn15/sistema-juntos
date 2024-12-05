import { Event } from "react-big-calendar";

export interface Appointment extends Event {
    title: string;
    id: number;
    patientName: string;
    start: Date;
    end: Date;
    checked: boolean;
  }