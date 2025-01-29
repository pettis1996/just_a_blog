"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
    email: string;
    name: string;
    website?: string;
    phone_num?: string;
};

interface UserContextType {
    user: User | null;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState("pettis_paris@hotmail.com");

    useEffect(() => {
        if (!userEmail) return;
        const fetchUserData = async () => {
            try {
                const res = await fetch(`/api/users?email=${encodeURIComponent(userEmail)}`);
                if (res.ok) {
                    const { user: data } = await res.json();
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.log("Error fetching user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
            setUserEmail("");
        };
    
        fetchUserData();
    }, [userEmail]);    

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