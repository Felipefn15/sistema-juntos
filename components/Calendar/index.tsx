"use client"

import type React from "react"

import { Calendar, momentLocalizer, type View } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import moment from "moment"
import { useState } from "react"
import type { Agendamento, Paciente, Pagamento } from "@/types"
import 'moment/locale/pt-br'
import CalendarToolbar from "./Toolbar"

const localizer = momentLocalizer(moment)

interface CalendarProps {
  existingPatients: Paciente[]
  setExistingPatients: React.Dispatch<React.SetStateAction<Paciente[]>>
  psicologaId: string
  setScheduleModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setEventDetailsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedEvent: React.Dispatch<React.SetStateAction<Agendamento | null>>
  newEvent?: Agendamento | null
  setNewEvent?: React.Dispatch<React.SetStateAction<Agendamento | null | undefined>>
}

export default function CalendarComponent({
  existingPatients,
  psicologaId,
  setScheduleModalOpen,
  setEventDetailsModalOpen,
  setSelectedEvent,
  setNewEvent,
}: CalendarProps) {
  const [view, setView] = useState<View>("week")
  const [date, setDate] = useState(new Date())

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    if (!setNewEvent) {
      return
    }
    setNewEvent({
      start_date: start.toISOString(),
      end_date: end.toISOString(),
      id: "",
      paciente_id: "",
      psicologa_id: psicologaId,
    })
    setScheduleModalOpen(true)
  }

  const handleSelectEvent = (event: Agendamento) => {
    if (event.psicologa_id !== psicologaId) {
      return
    }
    setSelectedEvent({
      ...event,
      paciente: existingPatients.find((patient) => patient.id === event.paciente_id),
    })
    setEventDetailsModalOpen(true)
  }

  const eventPropGetter = (event: Agendamento) => {
    const isOwnAppointment = event.psicologa_id === psicologaId
    const hasPayed = event.pagamento?.some((p: Pagamento) => p.pago)
    return {
      className: `${
        isOwnAppointment ? (hasPayed ? "bg-green-500" : "bg-red-500") : "bg-gray-300"
      } text-white rounded-lg p-1`,
    }
  }

  moment.locale('pt-br')

  return (
    <div className="p-4">
      <Calendar
        localizer={localizer}
        events={[]}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        className="custom-calendar"
        views={["month", "week", "day", "agenda"]}
        formats={{
          dateFormat: "D",
          dayFormat: (date: Date, culture: string, localizer: any) => 
            localizer.format(date, "ddd DD/MM", culture).replace(/^\w/, c => c.toLowerCase()),
          timeGutterFormat: "HH:mm",
          eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) => 
            `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`,
          dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
            `${moment(start).format("DD/MM/YYYY")} - ${moment(end).format("DD/MM/YYYY")}`,
        }}
        messages={{
          today: "Hoje",
          previous: "Anterior",
          next: "Próximo",
          month: "Mês",
          week: "Semana",
          day: "Dia",
          agenda: "Agenda",
        }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventPropGetter}
        min={new Date(1970, 1, 1, 8, 0)} // Start at 8 AM
        max={new Date(1970, 1, 1, 21, 0)} // End at 8 PM
        components={{
          toolbar: CalendarToolbar,
        }}
      />
    </div>
  )
}
