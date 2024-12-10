import { Dialog } from "@headlessui/react";
import { Evolucao, Paciente } from "@/types";
import { useEffect, useState } from "react";
import { fetchEvolucaoHistoryAPI } from "@/utils/apiUtils";
import { useRouter } from "next/router";

interface EvolucaoHistoryModalProps {
  paciente: Paciente | null | undefined;
  psicologaId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ITEMS_PER_PAGE = 5;

const EvolucaoHistoryModal = ({
  paciente,
  psicologaId,
  isOpen,
  onClose,
}: EvolucaoHistoryModalProps) => {
  const [history, setHistory] = useState<Evolucao[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);

  const paginatedHistory = history.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const loadHistory = async () => {
      if (paciente?.id && psicologaId) {
        setLoading(true);
        try {
          const data = await fetchEvolucaoHistoryAPI(paciente?.id, psicologaId);
          setHistory(data);
        } catch (error) {
          console.error("Error fetching evolução history:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, paciente?.id, psicologaId]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

   const handleEvolutionClick = (evolucao: Evolucao) => {
    const agendamento = evolucao.agendamento;
    const pacienteName = agendamento?.paciente?.nome || "";
    const psicologaName = agendamento?.psicologa?.nome || "";

    router.push({
      pathname: "/appointment",
      query: {
        eventId: agendamento?.id,
        pacienteName,
        start: agendamento?.start_date,
        end: agendamento?.end_date,
        psicologaName,
      },
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
          <h2 className="text-xl font-bold mb-4">
            Histórico de Evolução - {paciente?.nome}
          </h2>
          {loading ? (
            <p>Carregando...</p>
          ) : history.length === 0 ? (
            <p className="text-gray-600">Nenhuma evolução registrada.</p>
          ) : (
            <>
              <ul
                className="space-y-4 overflow-auto"
                style={{ maxHeight: "300px" }}
              >
                {paginatedHistory.map((item) => (
                  <li
                    key={item.id}
                    className="border p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleEvolutionClick(item)}
                  >
                    <p className="text-gray-700">
                      <strong>Descrição:</strong> {item.descricao}
                    </p>
                    <p className="text-gray-500 text-sm">
                      <strong>Data:</strong>{" "}
                      {new Date(item.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={handlePreviousPage}
                  className={`px-4 py-2 bg-gray-300 rounded ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-400"
                  }`}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  className={`px-4 py-2 bg-gray-300 rounded ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-400"
                  }`}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </button>
              </div>
            </>
          )}
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EvolucaoHistoryModal;
