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
        throw new Error(error.message);
      }

      // Return the updated patient data
      return res.status(200).json(data[0]);
    } catch (error: unknown) {
      console.error("Error updating patient:", error);

      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }

      // Handle unexpected error types
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }

  if (req.method === "DELETE") {
    try {
      if (!id) {
        return res.status(400).json({ error: "Patient ID is required" });
      }

      // Delete the patient
      const { error } = await supabase
        .from("paciente")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      return res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting patient:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // Handle unsupported methods
  return res.setHeader("Allow", ["PUT", "DELETE"]).status(405).json({ error: `Method ${req.method} Not Allowed` });
}
