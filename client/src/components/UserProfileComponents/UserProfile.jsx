// UserProfile.jsx
import React from 'react';

export function UserProfile({ user }) {
    return (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-blue-500 p-6 text-white">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-sm">{user.email}</p>
            </div>
            <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <img
                            src={user.avatar || "/default-avatar.png"}
                            alt={`${user.name}'s Avatar`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{user.name}</h2>
                        <p className="text-gray-600">{user.bio || "No bio available."}</p>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Contact Info</h3>
                    <ul className="list-disc pl-5 text-gray-700">
                        <li>Email: {user.email}</li>
                        <li>Phone: {user.phone || "N/A"}</li>
                        <li>Location: {user.location || "Unknown"}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
