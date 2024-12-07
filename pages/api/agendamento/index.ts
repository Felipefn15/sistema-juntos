import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { data, error } = await supabase
      .from("agendamento")
      .insert([req.body])
      .select("*");

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
        .from("agendamento")
        .select(`
          *,
          pagamento(pago) -- Include payment status
        `);


    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  return res.setHeader("Allow", ["GET", "POST"]).status(405).end(`Method ${req.method} Not Allowed`);
}
