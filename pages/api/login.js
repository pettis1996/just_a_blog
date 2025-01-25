import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabase";

const JWT_SECRET = process.env.JWT_SECRET; 

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        try {
            const { data: users, error } = await supabase
                .from("users")
                .select("*")
                .eq("email", email);

            if (error || users.length === 0) {
                return res.status(401).json({ error: "Invalid email or password." });
            }

            const user = users[0];
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ error: "Invalid email or password." });
            }

            // Generate a JWT
            const token = jwt.sign(
                { id: user.id, email: user.email }, // Payload
                JWT_SECRET, // Secret
                { expiresIn: "2h" } // Expiry
            );

            // Send token as a cookie
            res.setHeader("Set-Cookie", `token=${token}; Path=/; HttpOnly; Max-Age=7200;`);

            return res.status(200).json({ message: "Login successful.", user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Something went wrong during login." });
        }
    }

    res.status(405).send("Method Not Allowed");
}