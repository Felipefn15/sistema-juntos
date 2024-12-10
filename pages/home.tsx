import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, EventPropGetter } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import ScheduleModal from "@/components/ScheduleModal";
import EventDetailsModal from "@/components/EventDetailsModal";
import { Agendamento, Paciente } from "@/types";
import { withAuth } from "@/utils/withAuth";
import {
  deleteAppointmentAPI,
  fetchAppointmentsAPI,
  fetchPatientsAPI,
} from "@/utils/apiUtils";
import { useSession } from "next-auth/react";

export const getServerSideProps = withAuth();

const localizer = momentLocalizer(moment);

const Home = () => {
  const { data: session } = useSession();
  const psicologaId = session?.user?.psicologa?.id || ""; // Retrieve psicologa_id from session

  const [events, setEvents] = useState<Agendamento[]>([]);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [eventDetailsModalOpen, setEventDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Agendamento | null>(null);
  const [newEvent, setNewEvent] = useState<Agendamento | null>();
  const [existingPatients, setExistingPatients] = useState<Paciente[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const patients = await fetchPatientsAPI();
        setExistingPatients(patients);

        const appointments = await fetchAppointmentsAPI();
        const formattedAppointments = appointments.map(
          (appointment: Agendamento) => ({
            ...appointment,
            start: new Date(appointment.start_date),
            end: new Date(appointment.end_date),
          })
        );
        setEvents(formattedAppointments);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    loadData();
  }, [scheduleModalOpen]);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setNewEvent({
      start_date: start.toDateString(),
      end_date: end.toDateString(),
      id: "",
      paciente_id: "",
      psicologa_id: psicologaId,
    });
    setScheduleModalOpen(true);
  };

  const handleSelectEvent = (event: Agendamento) => {
    if (event.psicologa_id !== psicologaId) {
      return; // Prevent actions on unrelated events
    }
    setSelectedEvent({
      ...event,
      paciente: existingPatients.find(
        (patient) => patient.id === event.paciente_id
      ),
    });
    setEventDetailsModalOpen(true);
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        const deletedAppointment = await deleteAppointmentAPI(selectedEvent.id);
        if (deletedAppointment) {
          setEvents((prevEvents) =>
            prevEvents.filter((e) => e.id !== selectedEvent.id)
          );
          setEventDetailsModalOpen(false);
        }
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  const handleWriteNotes = () => {
    if (selectedEvent) {
      const { id, paciente, start_date, end_date, psicologa } =
        selectedEvent;
      window.location.href = `/appointment?eventId=${id}&pacienteName=${paciente?.nome}&start=${start_date}&end=${end_date}&psicologaName=${psicologa?.nome}`;
    }
  };

  const CustomEvent = ({ event }: { event: Agendamento }) => {
    const patientName =
      existingPatients.find((patient) => patient.id === event.paciente_id)
        ?.nome || "Paciente";
    const isOwnAppointment = event.psicologa_id === psicologaId;

    return (
      <span>
        {isOwnAppointment
          ? patientName
          : `${patientName} - ${event.psicologa?.nome}`}{" "}
        {/* Include psicologa name */}
      </span>
    );
  };

  const eventPropGetter: EventPropGetter<Agendamento> = (
    event: Agendamento
  ) => {
    const isOwnAppointment = event.psicologa_id === psicologaId;

    return {
      style: {
        backgroundColor: isOwnAppointment ? "#419e60" : "#d3d3d3", // Green for own, gray for others
        color: isOwnAppointment ? "white" : "black",
        fontWeight: "bold",
        borderRadius: "5px",
        pointerEvents: isOwnAppointment ? "auto" : "none", // Disable click for unrelated events
      },
    };
  };

  return (
    <div className="min-h-screen p-2 md:p-8 bg-gray-100 lg:ml-64">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Agenda</h1>
        <button
          onClick={() => location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Atualizar
        </button>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        defaultView="day"
        views={["week", "day", "agenda"]}
        defaultDate={new Date()}
        style={{ height: "85vh", margin: "0", maxWidth: "100%" }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventPropGetter}
        components={{
          event: CustomEvent,
        }}
        formats={{
          timeGutterFormat: "HH:mm",
          eventTimeRangeFormat: ({ start, end }) =>
            `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`,
          dayRangeHeaderFormat: ({ start, end }) =>
            `${moment(start).format("DD/MM/YYYY")} – ${moment(end).format(
              "DD/MM/YYYY"
            )}`,
        }}
        min={new Date(1970, 1, 1, 7, 0)}
        max={new Date(1970, 1, 1, 22, 0)}
      />
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
  );
};

export default Home;
