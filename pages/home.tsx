import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, EventPropGetter } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import ScheduleModal from "@/components/ScheduleModal";
import EventDetailsModal from "@/components/EventDetailsModal";
import { Appointment, AppointmentWithPatient, Patient } from "@/types";
import { withAuth } from "@/utils/withAuth";
import { fetchAppointmentsAPI, fetchPatientsAPI, deleteAppointmentAPI } from "@/utils/apiUtils";

export const getServerSideProps = withAuth();

const localizer = momentLocalizer(moment);

const Home = () => {
  const [events, setEvents] = useState<Appointment[]>([]);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [eventDetailsModalOpen, setEventDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AppointmentWithPatient | null>(null);
  const [newEvent, setNewEvent] = useState<Appointment | null>();
  const [existingPatients, setExistingPatients] = useState<Patient[]>([]);

  // Function to load data from API
  const loadData = async () => {
    try {
      // Fetch and set patients
      const patients = await fetchPatientsAPI();
      setExistingPatients(patients);

      // Fetch and set appointments
      const appointments = await fetchAppointmentsAPI();
      const formattedAppointments = appointments.map((appointment: Appointment) => ({
        ...appointment,
        start: new Date(appointment.start_date),
        end: new Date(appointment.end_date),
      }));
      setEvents(formattedAppointments);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  // Load data on mount and when modal closes
  useEffect(() => {
    loadData();
  }, [scheduleModalOpen]);

  // Handle slot selection
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setNewEvent({
      checked: false,
      start_date: start,
      end_date: end,
      id: "",
      paciente_id: "",
      psicologa_id: "98b0d401-bc35-45ca-8caa-fa1452890b7c",
    });
    setScheduleModalOpen(true);
  };

  // Handle event selection
  const handleSelectEvent = (event: Appointment) => {
    setSelectedEvent({
      ...event,
      Patient: existingPatients.find((patient) => patient.id === event.paciente_id),
    });
    setEventDetailsModalOpen(true);
  };

  // Handle delete event
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

  // Mark event as completed
  const handleCheckEvent = () => {
    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === selectedEvent.id ? { ...e, checked: !e.checked } : e
        )
      );
      setEventDetailsModalOpen(false);
    }
  };

  // Redirect to appointment notes page
  const handleWriteNotes = () => {
    if (selectedEvent) {
      const { id, Patient, start_date, end_date, psicologa_id } = selectedEvent;
      window.location.href = `/appointment?eventId=${id}&pacienteName=${Patient?.nome}&start=${start_date}&end=${end_date}&psicologaName=${psicologa_id}`;
    }
  };

  // Custom event rendering
  const CustomEvent = ({ event }: { event: Appointment }) => (
    <span>
      {existingPatients.find((patient) => patient.id === event.paciente_id)?.nome}
    </span>
  );

  // Custom event style
  const eventPropGetter: EventPropGetter<Appointment> = (event: Appointment) => {
    const backgroundColor = event.checked ? "#419e60" : "#a34346";
    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "5px",
        marginLeft: "5px",
      },
    };
  };

  return (
    <div className="min-h-screen p-2 md:p-8 bg-gray-100 lg:ml-64">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Agenda</h1>
        <button
          onClick={loadData}
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
            `${moment(start).format("DD/MM/YYYY")} – ${moment(end).format("DD/MM/YYYY")}`,
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
        onCheck={handleCheckEvent}
      />
    </div>
  );
};

export default Home;
