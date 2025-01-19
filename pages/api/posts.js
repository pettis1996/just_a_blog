import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, content, author, excerpt, created_at } = req.body;

    const { data, error } = await supabase
      .from("posts")
      .insert([{ title, content, author, excerpt, created_at }]);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  }

  res.status(405).send("Method Not Allowed");
}