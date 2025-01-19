"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState(""); // Add author input
    const [date, setDate] = useState("");
    const { data: session } = useSession();
    const router = useRouter();

    console.log(session?.user?.email)
    console.log(process.env.ADMIN_EMAIL);

    useEffect(() => {
        // TODO: Fix this to get from .env file
        if (session?.user?.email !== "pettisparis@gmail.com") {
            router.push("/");
        }
    }, [session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newPost = {
            title,
            content,
            author: author || session?.user?.name || "Admin", // Use the session user's name as a fallback
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
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                {/* Add your stats-related content here */}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1,234</div>
                                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                        {/* Add more stats cards as needed */}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}