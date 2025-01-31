import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(401).json({ error: error.message });
      }

      const user = data.user;

      const accessToken = data.session.access_token;
      res.setHeader(
        "Set-Cookie",
        `token=${accessToken}; Path=/; HttpOnly; Max-Age=7200;`
      );

      return res.status(200).json({ message: "Login successful.", user });
    } catch (error) {
      console.error("Login error:", error);
      return res
        .status(500)
        .json({ error: "Something went wrong during login." });
    }
  }

  res.status(405).send("Method Not Allowed");
}
