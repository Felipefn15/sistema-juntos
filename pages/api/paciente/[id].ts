import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const { nome, contato, responsavel, data_nascimento } = req.body;

      // Validate the data
      if (!nome || !contato || !responsavel || !data_nascimento) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Update the patient in the database
      const { data, error } = await supabase
        .from("paciente")
        .update({ nome, contato, responsavel, data_nascimento })
        .eq("id", id)
        .select("*");

      if (error) {
        throw error;
      }

      // Return the updated patient data
      return res.status(200).json(data[0]);
    } catch (error: any) {
      console.error("Error updating patient:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // Handle unsupported methods
  return res.setHeader("Allow", ["PUT"]).status(405).json({ error: `Method ${req.method} Not Allowed` });
}
