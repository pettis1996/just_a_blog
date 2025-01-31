import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ user });
  }

  if (req.method === "GET") {
    const { email } = req.query;

    if (!email) {
      return res
        .status(400)
        .json({ error: "Email query parameter is required" });
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const customData = {
      email: data.email,
      name: data.nickname,
      website: data.website,
      phone_num: data.phone_num,
    };

    return res.status(200).json({ user: customData });
  }

  res.status(405).send("Method Not Allowed");
}
