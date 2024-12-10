import { withAuth } from "@/utils/withAuth";
import { useEffect, useState } from "react";
import {
  fetchPatientsAPI,
  updatePatientAPI,
  addPatientAPI,
  deletePatientAPI,
} from "@/utils/apiUtils";
import { Paciente } from "@/types";
import PatientForm from "@/components/PatientForm";
import { Dialog } from "@headlessui/react";
import EvolucaoHistoryModal from "@/components/EvolucaoHistoryModal";
import PatientCard from "@/components/PatientCard";
import { useSession } from "next-auth/react";

export const getServerSideProps = withAuth();

const PatientPage = () => {
  const { data: session } = useSession();
  const psicologaId = session?.user?.psicologa?.id || "";

  const [patients, setPatients] = useState<Paciente[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Paciente | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletePatientId, setDeletePatientId] = useState<string | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedHistoryPatient, setSelectedHistoryPatient] = useState<
    Paciente | null | undefined
  >(null);

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

  const handleViewHistory = (patientId: string) => {
    setSelectedHistoryPatient(
      patients.find((patient) => patient.id === patientId)
    );
    setIsHistoryModalOpen(true);
  };

  const handleSavePatient = async (patient: Paciente) => {
    try {
      if (patient.id) {
        const updatedPatient = await updatePatientAPI(patient);
        setPatients((prev) =>
          prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
        );
      } else {
        const newPatient = await addPatientAPI(patient);
        setPatients((prev) => [...prev, newPatient]);
      }
      setSelectedPatient(null);
      setIsFormModalOpen(false);
    } catch (error) {
      console.error("Failed to save patient:", error);
    }
  };

  const handleDeletePatient = async () => {
    if (deletePatientId) {
      try {
        await deletePatientAPI(deletePatientId);
        setPatients((prev) =>
          prev.filter((patient) => patient.id !== deletePatientId)
        );
        setDeletePatientId(null);
        setIsConfirmModalOpen(false);
      } catch (error) {
        console.error("Failed to delete patient:", error);
      }
    }
  };

  return (
    <div className="min-h-screen p-2 md:p-8 bg-gray-100 lg:ml-64">
      <h1 className="mb-8 text-3xl font-semibold text-center text-blue-600">
        Pacientes
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onViewHistory={handleViewHistory}
            onEdit={(patient) => {
              setSelectedPatient(patient);
              setIsFormModalOpen(true);
            }}
            onDelete={(patientId) => {
              setDeletePatientId(patientId);
              setIsConfirmModalOpen(true);
            }}
          />
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => {
            setSelectedPatient(null);
            setIsFormModalOpen(true);
          }}
        >
          Adicionar Novo Paciente
        </button>
      </div>
      {isFormModalOpen && (
        <PatientForm
          patient={selectedPatient}
          onSave={handleSavePatient}
          onCancel={() => {
            setSelectedPatient(null);
            setIsFormModalOpen(false);
          }}
        />
      )}
      {isConfirmModalOpen && (
        <Dialog
          open={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-black opacity-30" />
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
              <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
              <p className="text-gray-700 mb-6">
                Tem certeza de que deseja excluir este paciente? Esta ação não
                pode ser desfeita.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setIsConfirmModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleDeletePatient}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
      <EvolucaoHistoryModal
        paciente={selectedHistoryPatient}
        psicologaId={psicologaId}
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </div>
  );
};

export default PatientPage;
