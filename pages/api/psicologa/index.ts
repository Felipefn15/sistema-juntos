import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const { email } = req.query;
  
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
  
      const { data, error } = await supabase
        .from("psicologa")
        .select("*")
        .eq("email", email as string)
        .limit(1) // Ensure only one row is returned
        .maybeSingle(); // Allows the query to return `null` instead of throwing an error
  
      if (error) {
        return res.status(500).json({ error: error.message });
      }
  
      if (!data) {
        return res.status(404).json({ error: "Psicologa not found" });
      }
  
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const { email, name, image, google_id, documento, contato } = req.body;

      if (!email || !google_id) {
        return res.status(400).json({ error: "Email and Google ID are required" });
      }
      const { data, error } = await supabase
        .from("psicologa")
        .insert([
          {
            email,
            nome:name,
            image,
            google_id,
            documento,
            contato
          },
        ])
        .select("*");

      if (error) {
        console.error("Supabase error:", error.message);
        return res.status(500).json({ error: "Failed to create psicologa" });
      }

      return res.status(201).json(data);
    }

    if (req.method === "PUT") {
      const { id, name, image } = req.body;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      const { data, error } = await supabase
        .from("psicologa")
        .update({ name, image })
        .eq("id", id)
        .select("*");

      if (error) {
        console.error("Supabase error:", error.message);
        return res.status(500).json({ error: "Failed to update psicologa" });
      }

      return res.status(200).json(data);
    }

    res.setHeader("Allow", ["GET", "POST", "PUT"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
