import React, { useState } from "react";
import { Calendar, momentLocalizer, EventPropGetter } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getSession } from "next-auth/react";
import moment from "moment";
import ScheduleModal from "@/components/ScheduleModal";
import EventDetailsModal from "@/components/EventDetailsModal";
import { Appointment } from "@/types";

const localizer = momentLocalizer(moment);

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

const Home = () => {
  const [events, setEvents] = useState<Appointment[]>([]);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [eventDetailsModalOpen, setEventDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<Appointment>>({});
  const [existingPatients] = useState(["John Doe", "Jane Smith", "Emily Davis"]); // Example patients

  // Handle slot selection
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setNewEvent({ start, end });
    setScheduleModalOpen(true);
  };

  // Add new event
  const handleAddEvent = () => {
    if (newEvent.title && newEvent.patientName) {
      const eventToAdd = {
        ...newEvent,
        id: events.length + 1,
        checked: false,
      } as Appointment;

      setEvents((prevEvents) => [...prevEvents, eventToAdd]);
      setScheduleModalOpen(false);
    } else {
      alert("Please provide all required details.");
    }
  };

  // Handle event selection
  const handleSelectEvent = (event: Appointment) => {
    setSelectedEvent(event);
    setEventDetailsModalOpen(true);
  };

  // Delete selected event
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.filter((e) => e.id !== selectedEvent.id)
      );
      setEventDetailsModalOpen(false);
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
      window.location.href = `/appointment?${new URLSearchParams({
        id: selectedEvent.id.toString(),
        title: selectedEvent.title,
        patientName: selectedEvent.patientName,
        start: selectedEvent.start.toISOString(),
        end: selectedEvent.end.toISOString(),
      })}`;
    }
  };

  // Custom event rendering
  const CustomEvent = ({ event }: { event: Appointment }) => (
    <span>
      {event.title} - {event.patientName}
    </span>
  );

  // Change the event color based on its status
  const eventPropGetter: EventPropGetter = (event: Appointment) => {
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
      <ScheduleModal
        existingPatients={existingPatients}
        handleAddEvent={handleAddEvent}
        modalOpen={scheduleModalOpen}
        setModalOpen={setScheduleModalOpen}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
      />

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
