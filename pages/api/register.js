import bcrypt from "bcrypt";
import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        try {
            // Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Store user in the database
            const { data, error } = await supabase
                .from("users") // Make sure your `users` table exists
                .insert([{ email, password: hashedPassword }]);

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ message: "User registered successfully.", user: data[0] });
        } catch (error) {
            return res.status(500).json({ error: "Something went wrong during registration." });
        }
    }

    res.status(405).send("Method Not Allowed");
}