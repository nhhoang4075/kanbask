"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getUsers } from "@/lib/UserActions";
import { UserProfile } from "@/components/UserProfileComponents/UserProfile";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            try {
                const users = await getUsers();
                const foundUser = users.find(u => u.id === userId);
                setUser(foundUser);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) return <div className="p-4">Loading...</div>;
    if (!user) return <div className="p-4">User not found</div>;

    return (
        <div className="p-4">
            <UserProfile user={user} />
        </div>
    );
}
