"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { useUser } from "@/providers/UserContext";

export default function Profile() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [website, setWebsite] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const { user, loading } = useUser();
    const [userData, setUserData] = useState(user ?? null);

    const handleSubmit = () => {
        return null;
    }

    useEffect(() => {
        if (!user) return;
        setUserData(user);
    }, [user])

    if (loading) {
        return <>Loading...</>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">My Profile</h2>
            <div className="space-y-4">
                <Card>
                    <CardContent className="py-10 flex gap-10 items-center">
                            <Image
                                src={userData?.avatar_url ?? "/avatar.svg"}
                                alt="User Avatar"
                                width={150}
                                height={150}
                                className="rounded-full shadow-md"
                            />
                            <div className="flex flex-col gap-5">
                                <p className="text-2xl font-bold flex gap-3 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                    {userData?.name}
                                </p>
                                <p className="text-xl font-medium flex gap-3 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z" />
                                    </svg>
                                    {userData?.email}
                                </p>
                                <p className="text-lg font-medium flex gap-3 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                    </svg>
                                    {userData?.phone_num}
                                </p>
                                <p className="text-lg font-medium flex gap-3 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                                    </svg>
                                    <a target="_blank" href={`https://${userData?.website}`}>{userData?.website}</a>
                                </p>
                            </div>
                    </CardContent>
                </Card>
            </div>
            <Tabs defaultValue="profile-settings" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile-settings">Profile Settings</TabsTrigger>
                    <TabsTrigger value="security">Security Settings</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                <TabsContent value="profile-settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Personal Settings</CardTitle>
                            <CardDescription>Manage and edit your profile`s personal settings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Nickname [Showing]</Label>
                                    <Input
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        type="text"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Email</Label>
                                    <Input
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Personal Website</Label>
                                    <Input
                                        id="website"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        type="text"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Phone Number</Label>
                                    <Input
                                        id="phone_num"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        type="text"
                                    />
                                </div>
                                <Button type="submit">Save Settings</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Personal Settings</CardTitle>
                            <CardDescription>Manage and edit your profile`s personal settings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Password</Label>
                                    <Input
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Email</Label>
                                    <Input
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                    />
                                </div>
                                <Button type="submit">Save Settings</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}