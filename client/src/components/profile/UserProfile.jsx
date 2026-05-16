import React, { useState } from "react";

import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCopy, FaShare, FaPrint } from "react-icons/fa";
import { IoMdTrophy } from "react-icons/io";
import { BsStarFill } from "react-icons/bs";

export function UserProfile({ user }) {
    const [showCopied, setShowCopied] = useState(false);
  
    const [userData, setFormData] = useState({
      name: user.fullname,
      title: "Senior Software Engineer",
      avatar: user.avatar_url || "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png",
      email: user.email,
      phone: user.phone || "N/A",
      location: user.location || "N/A",
      achievements: [
        { icon: <IoMdTrophy />, value: "150+", description: "Projects Completed" },
        { icon: <BsStarFill />, value: "50+", description: "Client Testimonials" },
        { icon: <IoMdTrophy />, value: "10+", description: "Years Experience" }
      ],
      social: [
        { icon: <FaGithub />, link: "https://github.com", color: "hover:text-gray-800" },
        { icon: <FaLinkedin />, link: "https://linkedin.com", color: "hover:text-blue-600" },
        { icon: <FaTwitter />, link: "https://twitter.com", color: "hover:text-blue-400" }
      ]
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value, // Cập nhật trực tiếp trường tương ứng
        }));
    };
    const handleSave = async () => {
      try {
        const serializableData = {
          name: userData.name,
          title: userData.title,
          avatar: userData.avatar,
          email: userData.email,
          phone: userData.phone,
          location: userData.location,
        };
    
        const response = await fetch(`http://localhost:3000/api/users/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serializableData),
        });
    
    
        const updatedUser = await response.json();
        console.log("User updated successfully:", updatedUser);
        setIsEditing(false); // Thoát chế độ chỉnh sửa
        return Response.json({ message: "User updated successfully", user: updatedUser }, { status: 200 });
      } catch (error) {
        console.error("Error updating user:", error);
      }
    };
  
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    };
  
    return (
      <div className="h-screen overflow-y-auto bg-gray-50 text-gray-800">
        <div className="container mx-auto px-4 py-8 max-w-4xl pb-16">
          <div className="flex justify-end mb-4"></div>
  
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex md:items-start p-6 gap-8">
              <div className="md:w-1/3 flex flex-col items-center">
                <div className="relative group">
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-48 h-48 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";
                    }}
                  />
                </div>
              </div>
  
              <div className="md:w-2/3 mt-6 md:mt-0">
                <h1 className="text-3xl md:text-4xl font-bold">{userData.name}</h1>
                <p className="text-xl text-gray-600 mt-2">{userData.title}</p>
  
                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-gray-500" />
                    <span>{userData.email}</span>
                    <button
                      onClick={() => copyToClipboard(userData.email)}
                      className="p-1 hover:bg-gray-100"
                    >
                      <FaCopy className="text-gray-500" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-gray-500" />
                    <span>{userData.phone}</span>
                    <button
                      onClick={() => copyToClipboard(userData.phone)}
                      className="p-1 hover:bg-gray-100"
                    >
                      <FaCopy className="text-gray-500" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className="text-gray-500" />
                    <span>{userData.location}</span>
                    <button
                      onClick={() => copyToClipboard(userData.location)}
                      className="p-1 hover:bg-gray-100"
                    >
                      <FaCopy className="text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="p-6 border-t border-gray-200">
              <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userData.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl text-blue-500">{achievement.icon}</span>
                      <div>
                        <div className="text-xl font-bold">{achievement.value}</div>
                        <div className="text-sm text-gray-600">
                          {achievement.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            <div className="p-6 border-t border-gray-200 ">
              <div className="flex justify-center space-x-6">
                {userData.social.map((platform, index) => (
                  <a
                    key={index}
                    href={platform.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-2xl text-gray-600  ${platform.color} transition-colors`}
                  >
                    {platform.icon}
                  </a>
                ))}
              </div>
            </div>
            
            
  
            <div className="p-6 border-t border-gray-200 flex justify-center space-x-4">
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaPrint />
                <span>Print Profile</span>
              </button>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
            {isEditing ? "Close Edit" : "Edit Profile"}
              </button>

              <button
                onClick={() => {
                  navigator.share({
                    title: userData.name,
                    text: `Check out ${userData.name}'s profile!`,
                    url: window.location.href,
                  });
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaShare />
                <span>Share Profile</span>
              </button>
            </div>
            {isEditing && (
            <div className="p-6 border-t border-gray-200">
              <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={userData.location}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          </div>
  
          {showCopied && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
              Copied to clipboard!
            </div>
          )}
        </div>
      </div>
    );
}
