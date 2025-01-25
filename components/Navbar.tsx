'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { signOut } from "next-auth/react";

export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); 

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

    const handleLogout = async () => {
        await signOut();
        
        try {
            const res = await fetch("/api/auth/logout", { method: "POST" });

            if (res.ok) {
                setIsAuthenticated(false);
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("An error occurred while logging out", error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Just a Blog</h1>
            <nav className="space-x-4">
                <Link href="/" className="hover:underline">Home</Link>
                {!isAuthenticated ? (
                    <>
                        <Link href="/login" className="hover:underline">Login</Link>
                        <Link href="/register" className="hover:underline">Register</Link>
                    </>
                ) : (
                    <>
                        <Link href="/profile" className="hover:underline">Profile</Link>
                        <Link href="/admin" className="hover:underline">Admin Panel</Link>
                        <button 
                            onClick={handleLogout}
                            className="text-red-600 hover:text-red-700 hover:underline"
                        >
                            Logout
                        </button>
                    </>
                )}
                <ModeToggle />
            </nav>
        </div>
    );
}