"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

type User = {
    email: string;
    name: string;
    website?: string;
    phone_num?: string;
    avatar_url?: string;
};

type Session = {
    email: string;
}

interface UserContextType {
    user: User | null;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);

    console.log(session?.email);   

    useEffect(() => {
        const fetchSession = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData?.session?.user) {
                await fetchUserData(sessionData.session.user.id);
                setSession(sessionData?.session.user as Session);
            } else {
                setLoading(false);
            }
        };

        fetchSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (session?.user) {
                    await fetchUserData(session.user.id);
                } else {
                    setUser(null);
                }
                setLoading(false);
            }
        );

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    const fetchUserData = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from("users")
                .select("nickname, phone_num, website, avatar_url")
                .eq("id", userId)
                .single();

            if (error) {
                console.error("Error fetching user data:", error.message);
                setUser(null);
            } else {
                setUser({
                    email: session?.email || "",
                    name: data.nickname || "",
                    website: data.website || "",
                    phone_num: data.phone_num || "",
                    avatar_url: data.avatar_url || "",
                });
                console.log(user);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setUser(null);
        }
    };

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}