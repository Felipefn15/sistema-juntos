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
    } catch (error: unknown) {
      // Type assertion to access properties on the error
      if (error instanceof Error) {
        console.error("Error deleting appointment:", error.message);
        return res.status(500).json({ error: error.message });
      }
      
      // Handle case where error isn't an instance of Error
      console.error("Unknown error:", error);
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }

  return res.setHeader("Allow", ["DELETE"]).status(405).end(`Method ${req.method} Not Allowed`);
}
