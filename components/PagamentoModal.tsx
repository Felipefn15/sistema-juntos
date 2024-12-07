import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { addPagamentoAPI } from "@/utils/apiUtils";

interface PagamentoModalProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  agendamentoId: string;
}

const PagamentoModal = ({ modalOpen, setModalOpen, agendamentoId }: PagamentoModalProps) => {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState(0);

  const handleSave = async () => {
    try {
      await addPagamentoAPI({
        descricao,
        valor,
        pago: true,
        agendamento_id: agendamentoId,
      });
      setModalOpen(false); // Close the modal after saving
    } catch (error) {
      console.error("Failed to save pagamento:", error);
      alert("Erro ao salvar o pagamento. Por favor, tente novamente.");
    }
  };

  return (
    <Dialog
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-30" onClick={() => setModalOpen(false)} />
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
          <h2 className="text-xl font-bold mb-4">Pagamento</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Descrição</label>
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Valor</label>
              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(Number(e.target.value))}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
          </div>
          <div className="flex justify-end mt-6 space-x-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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

export default PagamentoModal;
