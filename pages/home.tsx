"use client"

import { useEffect, useState } from "react"
import { type View } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import moment from "moment"
import ScheduleModal from "@/components/ScheduleModal"
import EventDetailsModal from "@/components/EventDetailsModal"
import Header from "@/components/Header"
import type { Agendamento, Paciente } from "@/types"
import { withAuth } from "@/utils/withAuth"
import { deleteAppointmentAPI, fetchAppointmentsAPI, fetchPatientsAPI } from "@/utils/apiUtils"
import { useSession } from "next-auth/react"
import CalendarComponent from "@/components/Calendar"

export const getServerSideProps = withAuth()


const Home = () => {
  const { data: session } = useSession()
  const psicologaId = session?.user?.psicologa?.id || ""
  const { user } = session
  const [events, setEvents] = useState<Agendamento[]>([])
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [eventDetailsModalOpen, setEventDetailsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Agendamento | null>(null)
  const [newEvent, setNewEvent] = useState<Agendamento | null>()
  const [existingPatients, setExistingPatients] = useState<Paciente[]>([])
  const [view, setView] = useState<View>("week")
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const loadData = async () => {
      try {
        const patients = await fetchPatientsAPI()
        setExistingPatients(patients)

        const appointments = await fetchAppointmentsAPI()
        const formattedAppointments = appointments.map((appointment: Agendamento) => ({
          ...appointment,
          start: new Date(appointment.start_date),
          end: new Date(appointment.end_date),
        }))
        setEvents(formattedAppointments)
      } catch (error) {
        console.error("Failed to load data:", error)
      }
    }

    loadData()
  }, [])

  const handleWriteNotes = () => {
    if (selectedEvent) {
      const { id, paciente, start_date, end_date, psicologa } = selectedEvent
      window.location.href = `/appointment?eventId=${id}&pacienteName=${paciente?.nome}&start=${start_date}&end=${end_date}&psicologaName=${psicologa?.nome}`
    }
  }

  const CustomEvent = ({ event }: { event: Agendamento }) => {
    const patientName = existingPatients.find((patient) => patient.id === event.paciente_id)?.nome || "Paciente"
    const isOwnAppointment = event.psicologa_id === psicologaId

    return (
      <span className="text-sm">{isOwnAppointment ? patientName : `${patientName} - ${event.psicologa?.nome}`}</span>
    )
  }


  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        const deletedAppointment = await deleteAppointmentAPI(selectedEvent.id)
        if (deletedAppointment) {
          setEvents((prevEvents) => prevEvents.filter((e) => e.id !== selectedEvent.id))
          setEventDetailsModalOpen(false)
        }
      } catch (error) {
        console.error("Failed to delete event:", error)
      }
    }
  }
 

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user}/>
      <main className="p-4 px-20">
       <CalendarComponent
        events={events}
        existingPatients={existingPatients}
        setExistingPatients={setExistingPatients}
        psicologaId={psicologaId}
        setScheduleModalOpen={setScheduleModalOpen}
        setEventDetailsModalOpen={setEventDetailsModalOpen}
        setSelectedEvent={setSelectedEvent}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        />
      </main>
      {newEvent && (
        <ScheduleModal
          existingPatients={existingPatients}
          modalOpen={scheduleModalOpen}
          setModalOpen={setScheduleModalOpen}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
        />
      )}
      <EventDetailsModal
        modalOpen={eventDetailsModalOpen}
        setModalOpen={setEventDetailsModalOpen}
        event={selectedEvent}
        onDelete={handleDeleteEvent}
        onWriteNotes={handleWriteNotes}
      />
    </div>
  )
}

export default Home

