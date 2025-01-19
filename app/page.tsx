"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const posts = [
  { id: 1, title: "Getting Started with Next.js", excerpt: "Learn the basics of Next.js and start building modern web applications.", content: "Next.js is a powerful React framework that makes it easy to build server-side rendered and statically generated web applications. In this post, we'll cover the basics of setting up a Next.js project and creating your first pages.", date: "2023-05-01" },
  { id: 2, title: "The Power of React Hooks", excerpt: "Explore how React Hooks can simplify your component logic and improve reusability.", content: "React Hooks have revolutionized the way we write React components. They allow you to use state and other React features without writing a class. In this post, we'll dive deep into the most commonly used hooks and how they can improve your code.", date: "2023-05-15" },
  { id: 3, title: "CSS-in-JS: Styled Components vs. Emotion", excerpt: "Compare two popular CSS-in-JS libraries and learn which one might be best for your project.", content: "CSS-in-JS has become increasingly popular in the React ecosystem. Two of the most widely used libraries are Styled Components and Emotion. In this post, we'll compare their features, performance, and developer experience to help you choose the right one for your project.", date: "2023-06-01" },
]

export default function Home() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-6">Latest Posts</h2>
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl">{post.title}</CardTitle>
            <CardDescription>{post.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{post.excerpt}</p>
            <AnimatePresence>
              {expandedId === post.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  <p>{post.content}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
                className="flex items-center"
              >
                {expandedId === post.id ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                    Read Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Read More
                  </>
                )}
              </Button>
              <Link href={`/post/${post.id}`} passHref>
                <Button variant="outline">View Full Post</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}