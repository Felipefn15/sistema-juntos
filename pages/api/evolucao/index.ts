// pages/api/evolucao/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabaseClient";

async function addDescription(description: string, eventId: string) {
  const { data, error } = await supabase
    .from("evolucao")
    .insert([{ descricao: description, agendamento_id: eventId, created_at: new Date(), updated_at: new Date() }])
    .select('*');

  if (error) {
    throw new Error(error.message);
  }

  return data[0]; // Return the inserted description object
}

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { description, eventId } = req.body;
      const newDescription = await addDescription(description, eventId as string);
      return res.status(201).json({ message: "Description added successfully", newDescription });
    }

    if (req.method === "DELETE") {
      const { descriptionId } = req.body;
      // Delete the description
      const success = await deleteDescription(descriptionId);
      if (success) {
        return res.status(200).json({ message: "Description deleted successfully" });
      } else {
        return res.status(400).json({ message: "Failed to delete description" });
      }
    }

    res.status(405).json({ message: "Method Not Allowed" });
  }  catch (error: unknown) {
    // Safely handle the unknown error type
    if (error instanceof Error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    } else {
      // Fallback error handling if error is not an instance of Error
      res.status(500).json({ message: "Internal Server Error", error: "An unknown error occurred" });
    }
  }
}