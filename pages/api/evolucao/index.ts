import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabaseClient";

// Add a new description
async function addDescription(description: string, eventId: string) {
  const { data, error } = await supabase
    .from("evolucao")
    .insert([{ descricao: description, agendamento_id: eventId, created_at: new Date(), updated_at: new Date() }])
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

// Delete a description
async function deleteDescription(descriptionId: string) {
  const { error } = await supabase
    .from("evolucao")
    .delete()
    .eq("id", descriptionId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

// Fetch evolucoes with filters for pacienteId and psicologaId
async function fetchEvolucoes(pacienteId: string, psicologaId: string) {
  const { data, error } = await supabase
  .from("evolucao")
  .select(`
    *,
    agendamento:agendamento_id (
      *,
      paciente (
        id, nome, contato, responsavel, data_nascimento
      ),
      psicologa (
        id, nome, email
      )
    )
  `)
  .eq("agendamento.paciente_id", pacienteId)
  .eq("agendamento.psicologa_id", psicologaId);
  if (error) {
    throw new Error(error.message);
  }

  return data.filter((evolucao) => evolucao.agendamento);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { description, eventId } = req.body;
      const newDescription = await addDescription(description, eventId as string);
      return res.status(201).json({ message: "Description added successfully", newDescription });
    }

    if (req.method === "DELETE") {
      const { descriptionId } = req.body;
      const success = await deleteDescription(descriptionId);
      if (success) {
        return res.status(200).json({ message: "Description deleted successfully" });
      } else {
        return res.status(400).json({ message: "Failed to delete description" });
      }
    }

    if (req.method === "GET") {
      const { pacienteId, psicologaId } = req.query;

      if (!pacienteId || !psicologaId) {
        return res.status(400).json({ error: "Paciente ID and Psicologa ID are required" });
      }

      const evolucoes = await fetchEvolucoes(pacienteId as string, psicologaId as string);
      return res.status(200).json(evolucoes);
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("API Error:", error.message);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    } else {
      console.error("Unknown Error:", error);
      res.status(500).json({ message: "Internal Server Error", error: "An unknown error occurred" });
    }
  }
}
