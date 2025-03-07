"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

type User = {
    id: string;
    email: string;
    name: string;
    website?: string;
    phone_num?: string;
    avatar_url?: string;
};

interface UserContextType {
    user: User | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData?.session?.user) {
                const userEmail = sessionData.session.user.email || "";
                await fetchUserData(sessionData.session.user.id, userEmail);
            } else {
                setLoading(false);
            }
        };

        fetchSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (session?.user) {
                    const userEmail = session.user.email || "";
                    await fetchUserData(session.user.id, userEmail);
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

    const fetchUserData = async (userId: string, userEmail: string) => {
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
                    id: userId,
                    email: userEmail,
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

    const refreshUser = async () => {
        if (user?.id) {
          await fetchUserData(user.id, user.email);
        }
    };

    return (
        <UserContext.Provider value={{ user, loading, refreshUser }}>
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