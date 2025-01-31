import { serialize } from "cookie";

export default function handler(req, res) {
  if (req.method === "POST") {
    res.setHeader(
      "Set-Cookie",
      serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(0),
      })
    );
    return res.status(200).json({ message: "Logged out successfully" });
  }

  res.status(405).send("Method Not Allowed");
}
