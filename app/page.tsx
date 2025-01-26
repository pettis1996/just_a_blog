"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Post = { id: number, title: string, content: string, author: string, created_at: string, excerpt: string };
export default function Home() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const checkAuth = async () => {
          try {
              const res = await fetch("/api/auth/check", { credentials: "include" });

              if (res.ok) {
                  setIsAuthenticated(true);
              } else {
                  setIsAuthenticated(false);
              }
          } catch {
              setIsAuthenticated(false);
          }
      };

      checkAuth();
  }, []);

  useEffect(() => {
      const fetchPosts = async () => {
          try {
              const res = await fetch("/api/posts");
              const { data } = await res.json();
              setPosts(data);
          } finally {
              setLoading(false);
          }
      };

      fetchPosts();
  }, [isAuthenticated]);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-6">Latest Posts</h2>

      {loading && <p>Loading posts...</p>}

      {!loading && posts.length === 0 && <p>No posts available.</p>}

      {posts.map((post: Post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl">{post.title}</CardTitle>
            <CardDescription>{new Date(post.created_at).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{post.excerpt || post.content.substring(0, 100) + "..."}</p>
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
  );
}