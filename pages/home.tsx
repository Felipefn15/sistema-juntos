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

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const patients = await fetchPatientsAPI(); 
        setExistingPatients(patients);

      } catch (error) {
        console.error("Failed to load patients:", error);
      }
    };
    const loadAppointments = async () => {
      try {
        const appointments = await fetchAppointmentsAPI();
  
        // Convert the start and end dates to JavaScript Date objects
        const formattedAppointments = appointments.map((appointment: Appointment) => ({
          ...appointment,
          start: new Date(appointment.start_date),
          end: new Date(appointment.end_date),
        }));
  
        setEvents(formattedAppointments);
      } catch (error) {
        console.error("Failed to load appointments:", error);
      }
    };
    loadAppointments();
    loadPatients();
  }, [scheduleModalOpen]);

  // Handle slot selection
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setNewEvent({ 
     checked: false,
     start_date: start,
     end_date: end,
     id: '',
     paciente_id: '',
     psicologa_id: "98b0d401-bc35-45ca-8caa-fa1452890b7c"
    });
    setScheduleModalOpen(true);
  };

  // Handle event selection
  const handleSelectEvent = (event: Appointment) => {
    setSelectedEvent({
      ...event,
      Patient: existingPatients.find((patient) => patient.id === event.paciente_id)
    });
    setEventDetailsModalOpen(true);
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        // Call the API to delete the event
        const deletedAppointment = await deleteAppointmentAPI(selectedEvent.id);
        
        if (deletedAppointment) {
          // If the event is deleted successfully, remove it from the state
          setEvents((prevEvents) =>
            prevEvents.filter((e) => e.id !== selectedEvent.id)
          );
          setEventDetailsModalOpen(false);
        }
      } catch (error) {
        console.error("Failed to delete event:", error);
        // Optionally, show an error message to the user
      }
    }
  };

  // Mark event as completed (check)
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

  // Redirect to appointment page with event data
  const handleWriteNotes = () => {
    if (selectedEvent) {
      window.location.href = `/appointment`;
    }
  };

  // Custom event rendering
  const CustomEvent = ({ event }: { event: Appointment }) => (
    <span>
      {existingPatients.find((patient) => patient.id === event.paciente_id)?.nome}
    </span>
  );

  // Change the event color based on its status
  const eventPropGetter: EventPropGetter<Appointment> = (event: Appointment) => {
    let backgroundColor = "blue"; // Default color

    if (event.checked) {
      backgroundColor = "#419e60";
    } else if (!event.checked) {
      backgroundColor = "#a34346";
    }

    return {
      style: {
        backgroundColor,
        color: "white", // You can also set text color here if needed
        borderRadius: "5px", // Optional: Adding border radius to the event box
        marginLeft: '5px'
      },
    };
  };

  return (
    <div className="min-h-screen p-2 md:p-8 bg-gray-100 lg:ml-64">
      <h1 className="mb-6 text-3xl font-semibold text-center">Agenda</h1>
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
        eventPropGetter={eventPropGetter} // Apply event style customization
        components={{
          event: CustomEvent,
        }}
      />

      {/* Schedule Appointment Modal */}
      {newEvent && <ScheduleModal
        existingPatients={existingPatients}
        modalOpen={scheduleModalOpen}
        setModalOpen={setScheduleModalOpen}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
      />}

      {/* Event Details Modal */}
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
