import { supabase } from "../../lib/supabase";

export default async function CommentsHandler(req, res) {
    if (req.method === "GET") {
        const { postId } = req.body;

        const { data, error } = await supabase
            .from("comments")
            .select("id, content, created_at, user_id")
            .eq("post_id", postId)
            .order("created_at", { ascending: true });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ data });
    }

    if (req.method === "POST") {
        const { postId, userId, content } = req.body;

        const { data, error } = await supabase
            .from("comments")
            .insert([{ post_id: postId, user_id: userId, content }]);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ data });
    }
}