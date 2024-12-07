// pages/api/agendamento/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      // Perform the deletion in Supabase
      const { data, error } = await supabase
        .from("agendamento")
        .delete()
        .eq("id", id)
        .select('*');

      if (error) throw new Error(error.message);

      // Respond with the deleted appointment or a success message
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error deleting appointment:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.setHeader("Allow", ["DELETE"]).status(405).end(`Method ${req.method} Not Allowed`);
}
