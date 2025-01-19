"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    const { data: session } = useSession()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Logging in user:", username)
        router.push("/admin")
    }

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: "/admin" })
    }

    if (session) {
        router.push("/admin")
        return null
    }

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full">Login</Button>
                </form>
                <div className="mt-4">
                    <Button onClick={handleGoogleSignIn} className="w-full">Sign in with Google</Button>
                </div>
            </CardContent>
        </Card>
    )
}