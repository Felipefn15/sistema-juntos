import React, { useState } from "react";
import { Paciente } from "@/types";

interface PatientFormProps {
  patient?: Paciente | null; // Pass null for creating a new patient
  onSave: (data: Paciente) => void; // Callback when the form is submitted
  onCancel: () => void; // Callback to close the form
}

const PatientForm: React.FC<PatientFormProps> = ({ patient, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Paciente>(
    patient || {
      id: "", // Generate this server-side for new patients
      nome: "",
      contato: "",
      responsavel: "",
      data_nascimento: "",
    }
  );

  const handleChange = (field: keyof Paciente, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.nome || !formData.contato || !formData.data_nascimento) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-600">
          {patient ? "Editar Paciente" : "Novo Paciente"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contato</label>
            <input
              type="text"
              value={formData.contato}
              onChange={(e) => handleChange("contato", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Responsável</label>
            <input
              type="text"
              value={formData.responsavel}
              onChange={(e) => handleChange("responsavel", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
            <input
              type="date"
              value={formData.data_nascimento}
              onChange={(e) => handleChange("data_nascimento", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
