import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, nickname, website, phone_num, avatar_url } =
      req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        return res.status(500).json({ error: authError.message });
      }

      const userId = authData.user?.id;

      if (!userId) {
        return res
          .status(500)
          .json({ error: "User ID not available after registration." });
      }

      const { error: profileError } = await supabase.from("users").insert({
        id: userId,
        nickname,
        website,
        phone_num,
        avatar_url,
      });

      if (profileError) {
        return res.status(500).json({ error: profileError.message });
      }

      return res.status(200).json({ message: "User registered successfully." });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error || "Something went wrong during registration." });
    }
  }

  res.status(405).send("Method Not Allowed");
}
