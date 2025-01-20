"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from 'next/image';

export default function Profile() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const { data: session, status } = useSession();
    const userData = session?.user;

    console.log("userData", userData)

    const handleSubmit = () => {
        return null;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">My Profile</h2>
            <div className="space-y-4">
                <Card>
                    <CardContent className="py-10 flex gap-5">
                        <Image
                            src={userData?.image ?? "/globe.svg"}
                            alt="User Avatar"
                            width={150} 
                            height={150}
                            className="rounded-2xl shadow-md"
                        />
                        <div className="flex flex-col gap-5">
                            <p className="text-3xl font-bold">{userData?.name}</p>
                            <p className="text-2xl font-medium">{userData?.email}</p>
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
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Username [Showing]</Label>
                                    <Input
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Email</Label>
                                    <Input
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
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
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Password</Label>
                                    <Input
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
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