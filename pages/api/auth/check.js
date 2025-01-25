import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default function handler(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        jwt.verify(token, JWT_SECRET); 
        return res.status(200).json({ message: "Authenticated" });
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}