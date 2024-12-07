// pages/api/evolucao/[eventId].ts

import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabaseClient";

async function getDescriptions(eventId: string) {
  const { data, error } = await supabase
    .from("evolucao")
    .select("*")
    .eq("agendamento_id", eventId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}


// Edit a description
async function updateDescription(descriptionId: string, newDescription: string) {
  const { error } = await supabase
    .from("evolucao")
    .update({ descricao: newDescription })
    .eq("id", descriptionId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { eventId } = req.query;

  try {
    if (req.method === "GET") {
      // Fetch descriptions for a specific event
      const descriptions = await getDescriptions(eventId as string);
      return res.status(200).json(descriptions);
    }

    if (req.method === "PATCH") {
      const { descriptionId, newDescription } = req.body;
      // Update the description
      const success = await updateDescription(descriptionId, newDescription);
      if (success) {
        return res.status(200).json({ message: "Description updated successfully" });
      } else {
        return res.status(400).json({ message: "Failed to update description" });
      }
    }

    res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
