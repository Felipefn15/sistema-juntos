import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { descricao, valor, pago, agendamento_id } = req.body;

    if (!descricao || !valor || pago === undefined || !agendamento_id) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const { data, error } = await supabase
      .from("pagamento")
      .insert([{ descricao, valor, pago, agendamento_id }])
      .select("*");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  }

  return res.setHeader("Allow", ["POST"]).status(405).end();
}
