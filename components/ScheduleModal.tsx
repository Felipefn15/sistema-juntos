import { useState } from "react";
import { Appointment, Patient } from "@/types";
import { Dialog } from "@headlessui/react";
import { addAppointmentAPI, addPatientAPI } from "@/utils/apiUtils";

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
  const [newPatientDetails, setNewPatientDetails] = useState({
    nome: "",
    data_nascimento: "",
    contato: "",
    responsavel: "",
  });

  const handleSaveAppointment = async (event: Appointment) => {
    // Save the appointment once the patient is saved or selected
    await addAppointmentAPI({
      paciente_id: event.paciente_id,
      psicologa_id: event.psicologa_id,
      start_date: event.start_date,
      end_date: event.end_date,
    });
    setModalOpen(false); // Close the modal after saving
  };

  const handleSave = async () => {
    try {
      // If the selected patient is "new", we need to create a new patient
      if (newEvent.paciente_id === "new" || existingPatients.length === 0) {
        const { nome, data_nascimento, contato, responsavel } = newPatientDetails;

        // Validate required fields for the new patient
        if (!nome || !data_nascimento || !contato || !responsavel) {
          alert("Please fill in all the patient details.");
          return;
        }

        // Create the new patient via the API
        const newPatient = {
          nome,
          data_nascimento,
          contato,
          responsavel,
        };

        const createdPatient = await addPatientAPI(newPatient);
        if (!createdPatient) {
          alert("Failed to create new patient.");
          return;
        }

        // Update the newEvent with the newly created patient's details
        setNewEvent({
          ...newEvent,
          paciente_id: createdPatient.id, // Store the paciente_id
          psicologa_id: "98b0d401-bc35-45ca-8caa-fa1452890b7c", // Reset psicologa_id as well
        });
        // After the state is updated, save the appointment
        await handleSaveAppointment({
          ...newEvent,
          paciente_id: createdPatient.id, // Ensure correct paciente_id is passed
        });
      } else {
        // If the patient was selected (not new), directly save the appointment
        await handleSaveAppointment(newEvent);
      }

      setModalOpen(false); // Close the modal after saving
    } catch (error) {
      console.error("Error saving new patient or appointment:", error);
      alert("Failed to save the patient or appointment. Please try again.");
    }
  };

  return (
    <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <h2 className="text-lg font-bold mb-4">Agendamento</h2>

          {/* Patient Selection */}
          {existingPatients.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Paciente</label>
              <select
                className="w-full border border-gray-300 rounded p-2"
                value={newEvent.paciente_id} // Use paciente_id here
                onChange={(e) => setNewEvent({ ...newEvent, paciente_id: e.target.value })}
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

          {/* New Patient Fields */}
          {newEvent.paciente_id === "new" || existingPatients.length === 0 ? (
            <>
              <label className="block text-sm font-medium mb-2">Paciente</label>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nome</label>
                <input
                  type="text"
                  placeholder="Nome do paciente"
                  value={newPatientDetails.nome}
                  onChange={(e) => setNewPatientDetails({ ...newPatientDetails, nome: e.target.value })}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Data de Nascimento</label>
                <input
                  type="date"
                  value={newPatientDetails.data_nascimento}
                  onChange={(e) =>
                    setNewPatientDetails({ ...newPatientDetails, data_nascimento: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Contato</label>
                <input
                  type="tel"
                  placeholder="Telefone do paciente"
                  value={newPatientDetails.contato}
                  onChange={(e) => {
                    const phoneNumber = e.target.value.replace(/[^0-9]/g, ""); // Remove any non-numeric characters
                    setNewPatientDetails({ ...newPatientDetails, contato: phoneNumber });
                  }}
                  maxLength={15} // Set a max length for phone numbers
                  className="w-full border border-gray-300 rounded p-2"
                />
                <small className="text-gray-500">Insira apenas números, EX. 21923456789</small>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Responsável</label>
                <input
                  type="text"
                  placeholder="Nome do responsável"
                  value={newPatientDetails.responsavel}
                  onChange={(e) => setNewPatientDetails({ ...newPatientDetails, responsavel: e.target.value })}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
            </>
          ) : null}

          {/* Actions */}
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-gray-300 rounded mr-2" onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSave}>
              Salvar
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ScheduleModal;
