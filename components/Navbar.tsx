"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setIsAuthenticated(!!session);
        });

        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setIsAuthenticated(!!user);
        };

        checkAuth();

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            setIsAuthenticated(false);
            router.push("/");
        } else {
            console.error("Logout failed", error);
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