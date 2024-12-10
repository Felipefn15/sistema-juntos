import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { updatePsicologaAPI } from "@/utils/apiUtils";
import { Psicologa } from "@/types";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  psicologa: Psicologa| null | undefined;
  onSave: (updatedPsicologa: Psicologa) => void; // Callback function to pass updated data

}

const MAX_PHONE_LENGTH = 15; // Maximum length for phone numbers in the format (xx)9xxxx-xxxx

const EditProfileModal = ({ isOpen, onClose, psicologa, onSave }: EditProfileModalProps) => {
  const [editData, setEditData] = useState({
    nome: psicologa?.nome || "",
    email: psicologa?.email || "",
    documento: psicologa?.documento || "",
    contato: psicologa?.contato || "",
  });

  // Function to format the phone number input
  const formatPhoneNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, ""); // Remove all non-numeric characters
    const match = numericValue.match(/^(\d{2})(\d{5})(\d{4})$/);

    if (match) {
      return `(${match[1]})${match[2]}-${match[3]}`;
    }
    return numericValue; // Return the raw input if incomplete
  };

  const handlePhoneNumberChange = (value: string) => {
    const formattedPhone = formatPhoneNumber(value);
    if (value.length + 1 <= MAX_PHONE_LENGTH) {
      setEditData({ ...editData, contato: formattedPhone });
    }
  };

  const handleSave = async () => {
    try {
      if (!psicologa) return;
      const updatedPsicologa = await updatePsicologaAPI({
        id: psicologa.id,
        ...editData,
      }) as Psicologa[];
      onSave(updatedPsicologa?.[0]); // Trigger the callback with the updated data
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
          <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Nome</label>
              <input
                type="text"
                value={editData.nome}
                onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={editData.email}
                className="w-full border border-gray-300 rounded px-3 py-2"
                disabled // Prevent editing email
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Documento</label>
              <input
                type="text"
                value={editData.documento}
                onChange={(e) => setEditData({ ...editData, documento: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Contato</label>
              <input
                type="text"
                value={editData.contato}
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                maxLength={MAX_PHONE_LENGTH} // Limit input length
              />
              <small className="text-gray-500">
                Formato esperado: (xx)9xxxx-xxxx, máximo de {MAX_PHONE_LENGTH} caracteres.
              </small>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleSave}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EditProfileModal;
