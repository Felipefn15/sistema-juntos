import { withAuth } from "@/utils/withAuth";
import { useEffect, useState } from "react";
import { fetchPatientsAPI, updatePatientAPI, addPatientAPI } from "@/utils/apiUtils";
import { Patient } from "@/types";
import PatientForm from "@/components/PatientForm";

export const getServerSideProps = withAuth();

const PatientPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Fetch patients on load
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await fetchPatientsAPI();
        setPatients(data);
      } catch (error) {
        console.error("Failed to load patients:", error);
      }
    };

    loadPatients();
  }, []);

  const handleSavePatient = async (patient: Patient) => {
    try {
      if (patient.id) {
        // Update existing patient
        const updatedPatient = await updatePatientAPI(patient);
        setPatients((prev) =>
          prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
        );
      } else {
        // Add new patient
        const newPatient = await addPatientAPI(patient);
        setPatients((prev) => [...prev, newPatient]);
      }
      setSelectedPatient(null); 
      setIsFormModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Failed to save patient:", error);
    }
  };

  return (
    <div className="min-h-screen p-2 md:p-8 bg-gray-100 lg:ml-64">
      <h1 className="mb-8 text-3xl font-semibold text-center text-blue-600">
        Pacientes
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-lg shadow-md p-6 space-y-4 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-blue-500">{patient.nome}</h2>
            <p className="text-gray-700">
              <strong>Contato:</strong> {patient.contato}
            </p>
            <p className="text-gray-700">
              <strong>Responsável:</strong> {patient.responsavel}
            </p>
            <p className="text-gray-700">
              <strong>Data de Nascimento:</strong> {new Date(patient.data_nascimento).toLocaleDateString("pt-BR")}
            </p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  setSelectedPatient(patient)
                  setIsFormModalOpen(true)
                }}
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => {
            setSelectedPatient(null)
            setIsFormModalOpen(true) // Open modal for new patient
            }
          } 
        >
          Adicionar Novo Paciente
        </button>
      </div>
      {isFormModalOpen && (
        <PatientForm
          patient={selectedPatient}
          onSave={handleSavePatient}
          onCancel={() => {
            setSelectedPatient(null)
            setIsFormModalOpen(false)
          }}
        />
      )}
    </div>
  );
};

export default PatientPage;
