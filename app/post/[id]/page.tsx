"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const posts = [
    { id: 1, title: "Getting Started with Next.js", content: "Next.js is a powerful React framework that makes it easy to build server-side rendered and statically generated web applications. In this post, we'll cover the basics of setting up a Next.js project and creating your first pages.", date: "2023-05-01" },
    { id: 2, title: "The Power of React Hooks", content: "React Hooks have revolutionized the way we write React components. They allow you to use state and other React features without writing a class. In this post, we'll dive deep into the most commonly used hooks and how they can improve your code.", date: "2023-05-15" },
    { id: 3, title: "CSS-in-JS: Styled Components vs. Emotion", content: "CSS-in-JS has become increasingly popular in the React ecosystem. Two of the most widely used libraries are Styled Components and Emotion. In this post, we'll compare their features, performance, and developer experience to help you choose the right one for your project.", date: "2023-06-01" },
]

export default function PostPage() {
    const params = useParams()
    const postId = Number(params.id)
    const post = posts.find(p => p.id === postId)

    if (!post) {
        return <div className="text-center text-2xl mt-8">Post not found</div>
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-3xl">{post.title}</CardTitle>
                <CardDescription>{post.date}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="leading-relaxed">{post.content}</p>
            </CardContent>
        </Card>
    )
}