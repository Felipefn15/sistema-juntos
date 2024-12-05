import React from "react";
import { Dialog } from "@headlessui/react";
import moment from "moment";
import { Appointment } from "@/types";

interface EventDetailsModalProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  event: Appointment | null;
  onDelete: () => void;
  onWriteNotes: () => void;
  onCheck: () => void;
}

const EventDetailsModal = ({
  modalOpen,
  setModalOpen,
  event,
  onDelete,
  onWriteNotes,
  onCheck,
}: EventDetailsModalProps) => {
  console.log({event})
  return (
    <Dialog
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-30" onClick={() => setModalOpen(false)}/>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
          {event && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">{event.patientName}</h2>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={onDelete}
                  >
                    Delete
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={onWriteNotes}
                  >
                    Write Notes
                  </button>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={onCheck}
                  >
                    {!event.checked ? 'Pago' : 'A Pagar'}
                  </button>
                </div>
              </div>
              <div className="mb-2">
                <strong>Title:</strong> {event.title}
              </div>
              <div className="mb-2">
                <strong>Time:</strong>{" "}
                {moment(event.start).format("hh:mm A")} -{" "}
                {moment(event.end).format("hh:mm A")}
              </div>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default EventDetailsModal;
