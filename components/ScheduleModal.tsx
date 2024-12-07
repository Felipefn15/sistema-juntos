import { useState } from "react";
import { Appointment, Patient } from "@/types";
import { Dialog } from "@headlessui/react";
import { addAppointmentAPI, addPatientAPI } from "@/utils/apiUtils";
import PatientForm from "@/components/PatientForm";

interface ScheduleModalProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  newEvent: Appointment;
  setNewEvent: (event: Appointment) => void;
  existingPatients: Patient[];
}

const ScheduleModal = ({
  modalOpen = false,
  setModalOpen,
  newEvent,
  setNewEvent,
  existingPatients,
}: ScheduleModalProps) => {
  const [isAddingNewPatient, setIsAddingNewPatient] = useState(false);

  const handleSaveAppointment = async (event: Appointment) => {
    await addAppointmentAPI({
      paciente_id: event.paciente_id,
      psicologa_id: event.psicologa_id,
      start_date: event.start_date,
      end_date: event.end_date,
    });
    setModalOpen(false);
  };

  const handleSavePatient = async (patient: Patient) => {
    try {
      // Add a new patient and associate with the event
      const createdPatient = await addPatientAPI(patient);

      if (!createdPatient) {
        alert("Failed to create a new patient.");
        return;
      }

      setNewEvent({
        ...newEvent,
        paciente_id: createdPatient.id,
      });
      
      await handleSaveAppointment({
        ...newEvent,
        paciente_id: createdPatient.id,
      })
      setIsAddingNewPatient(false); // Close the new patient form
      
    } catch (error) {
      console.error("Error saving patient:", error);
      alert("Failed to save the patient. Please try again.");
    }
  };

  return (
    <Dialog
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <h2 className="text-lg font-bold mb-4">Agendamento</h2>

          {!isAddingNewPatient ? (
            <>
              {/* Patient Selection */}
              {existingPatients.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Paciente</label>
                  <select
                    className="w-full border border-gray-300 rounded p-2"
                    value={newEvent.paciente_id} // Use paciente_id here
                    onChange={(e) => {
                      if (e.target.value === "new") {
                        setIsAddingNewPatient(true);
                      } else {
                        setNewEvent({ ...newEvent, paciente_id: e.target.value });
                      }
                    }}
                  >
                    <option value="">Selecione um Paciente</option>
                    {existingPatients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.nome}
                      </option>
                    ))}
                    <option value="new">Adicionar novo paciente</option>
                  </select>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-300 rounded mr-2"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={() => handleSaveAppointment(newEvent)}
                  disabled={!newEvent.paciente_id}
                >
                  Salvar
                </button>
              </div>
            </>
          ) : (
            <PatientForm
              patient={null}
              onSave={(patient) => handleSavePatient(patient)}
              onCancel={() => setIsAddingNewPatient(false)}
            />
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default ScheduleModal;
