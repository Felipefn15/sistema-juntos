import { NextApiRequest, NextApiResponse } from "next";
import { fetchPatients, createPatient } from "@/utils/supabase/supabaseCrud";

// Handle GET (fetch all patients) and POST (create a patient)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      // Fetch all patients using the fetchPatients utility
      const patients = await fetchPatients();
      return res.status(200).json(patients);
    }

    if (req.method === "POST") {
      // Create a new patient using the createPatient utility
      const { nome, data_nascimento, contato, responsavel } = req.body;

      if (!nome || !data_nascimento || !contato) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newPatient = await createPatient({ nome, data_nascimento, contato, responsavel });
      return res.status(201).json(newPatient);
    }

    return res.setHeader("Allow", ["GET", "POST"]).status(405).end(`Method ${req.method} Not Allowed`);
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