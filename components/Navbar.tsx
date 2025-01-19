'use client'

import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Just a Blog</h1>
            <nav className="space-x-4">
            <Link href="/" className="hover:underline">Home</Link>
            {!session ? (
                <>
                    <Link href="/login" className="hover:underline">Login</Link>
                    <Link href="/register" className="hover:underline">Register</Link>
                </>
            ) : (
                <>
                    <Link href="/profile" className="hover:underline">Profile</Link>
                    <Link href="/admin" className="hover:underline">Admin Panel</Link>
                    <button onClick={() => signOut()} className="text-red-600 hover:text-red-700 hover:underline">Logout</button>
                </>
            )}
            <ModeToggle />
            </nav>
        </div>
    );
}