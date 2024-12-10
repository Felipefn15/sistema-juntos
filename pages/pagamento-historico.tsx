import React, { useEffect, useState } from "react";
import { fetchAppointmentsAPI } from "@/utils/apiUtils"; // API utility to fetch appointments
import { Agendamento } from "@/types"; // Import the Agendamento type
import moment from "moment";
import { useSession } from "next-auth/react";

const PagamentoHistory = () => {
  const { data: session } = useSession();
  const psicologaId = session?.user?.psicologa?.id || ""; // Retrieve psicologa_id from session

  const [appointments, setAppointments] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch appointments on load
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await fetchAppointmentsAPI();
        setAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Histórico de Pagamentos
      </h1>
      {loading ? (
        <p className="text-center text-gray-600">Carregando...</p>
      ) : (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          {appointments.length === 0 ? (
            <p className="text-center text-gray-600">
              Nenhum agendamento encontrado.
            </p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Data
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Paciente
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {appointments.filter((appointment)=> appointment.psicologa_id === psicologaId).map((appointment) => {
                  // Calculate the total payment value and status
                  const totalValue = appointment?.pagamento?.reduce(
                    (acc, pagamento) => acc + pagamento.valor,
                    0
                  );
                  const allPaid = appointment?.pagamento?.every(
                    (pagamento) => pagamento.pago
                  );

                  return (
                    <tr key={appointment.id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {moment(appointment.start_date).format("DD/MM/YYYY")}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {appointment?.paciente?.nome}
                      </td>
                      <td
                        className={`border border-gray-300 px-4 py-2 ${
                          allPaid ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {allPaid ? "Pago" : "Não Pago"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        R$ {totalValue?.toFixed(2).replace(".", ",")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default PagamentoHistory;
