import { Evolucao } from "@/types";
import { addDescriptionAPI, getDescriptionsAPI, deleteDescriptionAPI } from "@/utils/apiUtils";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Appointment = () => {
  const router = useRouter();
  const { eventId, pacienteName, start, end, psicologaName } = router.query;

  const [description, setDescription] = useState("");
  const [descriptions, setDescriptions] = useState<Evolucao[]>([]); // Store description history

  // Fetch existing descriptions
  useEffect(() => {
    const fetchDescriptions = async () => {
      if (eventId && typeof eventId === "string") {
        const data = await getDescriptionsAPI(eventId);
        setDescriptions(data);
      }
    };

    fetchDescriptions();
  }, [eventId]);

  const handleSaveNotes = async () => {
    if (!description) return; // Ensure the description is not empty

    if (eventId && typeof eventId === "string") {
      await addDescriptionAPI({
        description,
        eventId,
      });

      // Re-fetch descriptions after adding a new one
      const data = await getDescriptionsAPI(eventId);
      setDescriptions(data);

      setDescription(""); // Clear textarea after saving
    }
  };

  const handleDeleteDescription = async (descriptionId: string) => {
    if (eventId && typeof eventId === "string") {
      await deleteDescriptionAPI(descriptionId);
      const data = await getDescriptionsAPI(eventId);
      setDescriptions(data);
    }
  };

  const handleEditDescription = (descriptionId: string, newDescription: string) => {
    // Implement editing logic (e.g., show an edit modal or directly modify the description)
    setDescription(newDescription); // Populate the textarea with the existing description
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  return (
    <div className="container mx-auto max-w-4xl p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Evolução</h1>

      {/* Agendamento Details */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <p className="font-semibold text-lg">
            <strong>Paciente:</strong>{" "}
            <span className="text-gray-600">{pacienteName}</span>
          </p>
          <p className="font-semibold text-lg">
            <strong>Psicóloga:</strong>{" "}
            <span className="text-gray-600">{psicologaName}</span>
          </p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold text-lg">
            <strong>Começo:</strong>{" "}
            <span className="text-gray-600">
              {start && typeof start === "string" && formatDate(start)}
            </span>
          </p>
          <p className="font-semibold text-lg">
            <strong>Fim:</strong>{" "}
            <span className="text-gray-600">
              {end && typeof end === "string" && formatDate(end)}
            </span>
          </p>
        </div>
      </div>

      {/* Textarea for adding new description */}
      <div className="mt-6">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          rows={6}
          placeholder="Escreva suas anotações aqui"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-center mt-6">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          onClick={handleSaveNotes}
        >
          Salvar
        </button>
      </div>

      {/* Description History */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Histórico de Evolucao</h2>
        {descriptions.length === 0 ? (
          <p className="text-gray-600">Nenhuma anotação registrada.</p>
        ) : (
          descriptions.map((desc) => (
            <div key={desc.id} className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="text-lg font-semibold">{desc.descricao}</p>
              <div className="flex justify-between mt-2">
                <button
                  className="text-blue-600"
                  onClick={() => handleEditDescription(desc.id, desc.descricao)}
                >
                  Editar
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleDeleteDescription(desc.id)}
                >
                  Deletar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointment;
