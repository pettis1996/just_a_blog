"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/providers/UserContext";

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
    const [commentDate, setCommentDate] = useState("");
    const [commentContent, setCommentContent] = useState("");
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comments[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();
    
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommentContent(e.target.value);
    };

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

    const postComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (user) {
            const newComment = {
                userId: user?.id,
                postId: postId,
                content: commentContent,
                created_at: commentDate || new Date().toISOString(),
            }
    
            try {
                const res = await fetch("/api/comments", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newComment),
                });
    
                const result = await res.json();
    
                if (res.ok) {
                    console.log("Comment added successfully:", result.data);
                    setCommentDate("");
                    setCommentContent("");
                } else {
                    console.error("Error creating post:", result.error);
                }
            } catch (err) {
                console.error("Failed to create post:", err);
            }
        } else {
            console.error("User not authenticated");
            return null;
        }
    }

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
            <Card className="max-w-5xl mx-auto mb-5">
                <CardHeader>
                    <CardTitle className="text-3xl">{post.title}</CardTitle>
                    <CardDescription>{new Date(post.created_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="leading-relaxed">{post.content}</p>
                </CardContent>
            </Card>
            <Card className="max-w-3xl mx-auto">
                {comments?.length ? (
                    <>
                        {comments.map((comment: Comments, index: number) => {
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
                        })}
                        <CardContent className="mt-5">
                            <form onSubmit={postComment} className="space-y-4">
                                <div>
                                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                                        Write your comment
                                    </label>
                                    <textarea
                                        id="comment"
                                        name="comment"
                                        rows={4}
                                        maxLength={500}
                                        placeholder="Write something thoughtful..."
                                        className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                                        required
                                    ></textarea>
                                    <div className="mt-2 text-sm text-gray-500">
                                        <span id="char-count">{commentContent.length}</span>/500 characters
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={!commentContent.trim()} 
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Post Comment
                                </button>
                            </form>
                        </CardContent>
                    </>
                ) : (
                    <Card className="max-w-3xl mx-auto">
                        <CardHeader>
                            <CardTitle>
                                No comments on this post yet!
                            </CardTitle>
                            <CardDescription>
                                Be the first to comment now.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={postComment} className="space-y-4">
                                <div>
                                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                                        Write your comment
                                    </label>
                                    <textarea
                                        id="comment"
                                        name="comment"
                                        onChange={handleInputChange}
                                        rows={4}
                                        maxLength={500}
                                        placeholder="Write something thoughtful..."
                                        className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                                        required
                                    ></textarea>
                                    <div className="mt-2 text-sm text-gray-500">
                                        <span id="char-count">0</span>/500 characters
                                    </div>
                                </div>

                                <div>
                                    <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Post Comment
                                    </button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </Card>
        </>
    );
}
