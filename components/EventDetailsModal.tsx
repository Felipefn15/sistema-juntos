import React from "react";
import { Dialog } from "@headlessui/react";
import moment from "moment";
import { AppointmentWithPatient } from "@/types";

interface EventDetailsModalProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  event: AppointmentWithPatient | null;
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
  return (
    <Dialog
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-30" onClick={() => setModalOpen(false)} />
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
          {event && (
            <>
              <div className="text-center mb-6">
                {/* Patient name and event info */}
                <h2 className="text-xl font-semibold">{event.Patient?.nome}</h2>
                <div className="text-sm text-gray-600">
                  {/* Date and time in default format (client's local time) */}
                  <p>{moment(event.start).format("dddd, MMMM D, YYYY")}</p>
                  <p>
                    {moment(event.start).format("HH:mm")} - {moment(event.end).format("HH:mm")}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-4 mb-4">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={onDelete}
                >
                  Delete
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={onWriteNotes}
                >
                  Write Notes
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={onCheck}
                >
                  {!event.checked ? "Pago" : "A Pagar"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default EventDetailsModal;
