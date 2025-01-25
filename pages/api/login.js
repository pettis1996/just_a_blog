import bcrypt from "bcrypt";
import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        try {
            // Fetch user from the database
            const { data: users, error } = await supabase
                .from("users")
                .select("*")
                .eq("email", email);

            if (error || users.length === 0) {
                return res.status(401).json({ error: "Invalid email or password." });
            }

            const user = users[0];

            // Compare passwords
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: "Invalid email or password." });
            }

            // Login successful
            return res.status(200).json({ message: "Login successful.", user });
        } catch (error) {
            return res.status(500).json({ error: "Something went wrong during login." });
        }
    }

    res.status(405).send("Method Not Allowed");
}