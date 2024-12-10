import React from "react";
import { Paciente } from "@/types";

interface PatientCardProps {
  patient: Paciente;
  onViewHistory: (patientId: string) => void;
  onEdit: (patient: Paciente) => void;
  onDelete: (patientId: string) => void;
}

const PatientCard = ({
  patient,
  onViewHistory,
  onEdit,
  onDelete,
}: PatientCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold text-blue-500">{patient.nome}</h2>
      <p className="text-gray-700">
        <strong>Contato:</strong> {patient.contato}
      </p>
      <p className="text-gray-700">
        <strong>Responsável:</strong> {patient.responsavel}
      </p>
      <p className="text-gray-700">
        <strong>Data de Nascimento:</strong>{" "}
        {new Date(patient.data_nascimento).toLocaleDateString("pt-BR")}
      </p>
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => onViewHistory(patient.id)}
        >
          Histórico
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => onEdit(patient)}
        >
          Editar
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => onDelete(patient.id)}
        >
          Deletar
        </button>
      </div>
    </div>
  );
};

export default PatientCard;
