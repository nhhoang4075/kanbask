// UserProfile.jsx
import React, { useState } from 'react';

export function UserProfile({ user }) {
    const [formData, setFormData] = useState({
        name: user.fullname,
        email: user.email,
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        console.log("Updated User Data:", formData);
        alert("Changes saved (not yet applied to the database).");
    };

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-blue-500 p-6 text-white">
                <h1 className="text-3xl font-bold">{formData.name}</h1>
                <p className="text-sm">{formData.email}</p>
            </div>
            <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <img
                            src={user.avatar_url || "/default-avatar.png"}
                            alt={`${formData.name}'s Avatar`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{formData.name}</h2>
                        <p className="text-gray-600">{formData.bio || "No bio available."}</p>
                    </div>
                </div>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
