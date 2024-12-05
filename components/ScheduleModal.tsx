import { Appointment } from "@/types";
import { Dialog } from "@headlessui/react";

interface ScheduleModalProps {
    modalOpen: boolean
    setModalOpen: (open: boolean) => void
    newEvent: Appointment
    setNewEvent: (event: Appointment) => void
    existingPatients: string[]
    handleAddEvent: () => void
}

const ScheduleModal = ({
    modalOpen = false,
    setModalOpen,
    newEvent,
    setNewEvent,
    existingPatients,
    handleAddEvent
}:ScheduleModalProps) => {
    return(
        <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4">Add Appointment</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                placeholder="Enter appointment title"
                value={newEvent.title || ""}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Patient</label>
              <select
                className="w-full border border-gray-300 rounded p-2"
                onChange={(e) =>
                  setNewEvent({ ...newEvent, patientName: e.target.value })
                }
              >
                <option value="">Select existing patient</option>
                {existingPatients.map((patient) => (
                  <option key={patient} value={patient}>
                    {patient}
                  </option>
                ))}
                <option value="new">Add new patient</option>
              </select>
              {newEvent.patientName === "new" && (
                <input
                  type="text"
                  placeholder="Enter new patient name"
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, patientName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded p-2 mt-2"
                />
              )}
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 rounded mr-2"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleAddEvent}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    )
}

export default ScheduleModal