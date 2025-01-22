import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { postId } = req.query;

        if (!postId) {
            return res.status(400).json({ error: "postId is required" });
        }

        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("post_id", postId)
            .order("created_at", { ascending: true });
            
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ data });
    }

    if (req.method === "POST") {
        const { postId, userId, content } = req.body;

        if (!postId) {
            return res.status(400).json({ error: "postId is required" });
        }

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        if (!content) {
            return res.status(400).json({ error: "content is required" });
        }

        const { data, error } = await supabase
            .from("comments")
            .insert([{ post_id: postId, user_id: userId, content }]);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ data });
    }
}