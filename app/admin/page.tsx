"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [postData, setPostData] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
                router.push("/");
            }
        };

        checkAuth();
    }, [router]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch("/api/posts");
                const { data, error } = await res.json();

                if (error) {
                    throw new Error(error);
                }

                setPostData(data);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newPost = {
            title,
            content,
            author: author || "Admin",
            excerpt,
            created_at: date || new Date().toISOString(),
        };

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPost),
            });

            const result = await res.json();

            if (res.ok) {
                console.log("Post created successfully:", result.data);
                setTitle("");
                setExcerpt("");
                setContent("");
                setAuthor("");
                setDate("");
            } else {
                console.error("Error creating post:", result.error);
            }
        } catch (err) {
            console.error("Failed to create post:", err);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Admin Dashboard</h2>
            <Tabs defaultValue="create-post" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="create-post">Create Post</TabsTrigger>
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                </TabsList>
                <TabsContent value="create-post">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Blog Post</CardTitle>
                            <CardDescription>Write and publish a new blog post</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="excerpt">Excerpt</Label>
                                    <Textarea
                                        id="excerpt"
                                        value={excerpt}
                                        onChange={(e) => setExcerpt(e.target.value)}
                                        required
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="content">Content</Label>
                                    <Textarea
                                        id="content"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                        rows={10}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="author">Author</Label>
                                    <Input
                                        id="author"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Publish Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>
                                <Button type="submit">Publish Post</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="stats">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="hover:bg-white hover:text-black hover:cursor-pointer">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1,234</div>
                                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card className="hover:bg-white hover:text-black hover:cursor-pointer">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{postData.length}</div>
                                <p className="text-xs text-muted-foreground">{postData.length} Total Posts on this blog so far...</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}