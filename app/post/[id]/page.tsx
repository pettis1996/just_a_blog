"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

interface Comments {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
}

export default function PostPage() {
    const params = useParams();
    const postId = params?.id;
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comments[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!postId) return;

        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/posts/${postId}`);
                if (!response.ok) {
                    throw new Error(`Error fetching post: ${response.statusText}`);
                }
                const data: Post = await response.json();
                setPost(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await fetch(`/api/comments?postId=${postId}`);
                if (!response.ok) {
                    throw new Error(`Error fetching post: ${response.statusText}`);
                }
                const data = await response.json();
                setComments(data.data)
            } catch (err: unknown) {
                if (err instanceof Error) {
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
        fetchComments();
    }, [postId]);

    if (loading) {
        return <div className="text-center text-2xl mt-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-2xl mt-8">Error: {error}</div>;
    }

    if (!post) {
        return <div className="text-center text-2xl mt-8">Post not found</div>;
    }

    return (
        <>
            <Card className="max-w-2xl mx-auto mb-5">
                <CardHeader>
                    <CardTitle className="text-3xl">{post.title}</CardTitle>
                    <CardDescription>{new Date(post.created_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="leading-relaxed">{post.content}</p>
                </CardContent>
            </Card>
            <Card className="max-w-2xl mx-auto">
                {comments?.length ? (
                    comments.map((comment: Comments, index: number) => {
                        return (
                            <div key={index}>
                                <CardHeader>
                                    <CardDescription>{new Date(comment.created_at).toLocaleDateString()}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="leading-relaxed">{comment.content}</p>
                                </CardContent>
                            </div>
                        );
                    })
                ) : (
                    <p>No comments yet.</p> 
                )}
            </Card>
        </>
    );
}
