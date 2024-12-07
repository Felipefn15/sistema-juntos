import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import moment from "moment";
import { AppointmentWithPatient, Pagamento } from "@/types";
import PagamentoModal from "./PagamentoModal"; // Import PagamentoModal

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
}: EventDetailsModalProps) => {
  const [pagamentoModalOpen, setPagamentoModalOpen] = useState(false);

  return (
    <>
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div
            className="fixed inset-0 bg-black opacity-30"
            onClick={() => setModalOpen(false)}
          />
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            {event && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold">
                    {event.Patient?.nome}
                  </h2>
                  <div className="text-sm text-gray-600">
                    <p>{moment(event.start).format("dddd, MMMM D, YYYY")}</p>
                    <p>
                      {moment(event.start).format("HH:mm")} -{" "}
                      {moment(event.end).format("HH:mm")}
                    </p>
                  </div>
                </div>

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
                    Evolução
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${
                      event.pagamento?.some((p: Pagamento) => p.pago)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                    onClick={() =>
                      !event.pagamento?.some((p: Pagamento) => p.pago) &&
                      setPagamentoModalOpen(true)
                    }
                    disabled={event.pagamento?.some((p: Pagamento) => p.pago)}
                  >
                    {event.pagamento?.some((p: Pagamento) => p.pago)
                      ? "Pago"
                      : "A Pagar"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Dialog>

      {/* Pagamento Modal */}
      <PagamentoModal
        modalOpen={pagamentoModalOpen}
        setModalOpen={setPagamentoModalOpen}
        agendamentoId={event?.id ?? ""}
      />
    </>
  );
};

export default EventDetailsModal;
