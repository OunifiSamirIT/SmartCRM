import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Users() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const userId = sessionStorage.getItem('userId');
    if (!token || !userId) {
      setError('No authentication token or user ID found');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/auth/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error.response || error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== user[key]) {
        updateData.append(key, formData[key]);
      }
    });
    if (selectedImage) {
      updateData.append('profileImage', selectedImage);
    }

    try {
      const response = await axios.put(`http://localhost:5000/auth/${user.id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setUser(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error.response || error);
      setError(error.message);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  if (!user) return <div className="flex justify-center items-center h-screen">No user data available.</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
          <h1 className="text-3xl font-bold text-white">User Profile</h1>
        </div>
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-6 mb-6">
                <img
                  src={selectedImage ? URL.createObjectURL(selectedImage) : (user.profileImage ? `http://localhost:5000/${user.profileImage}` : 'https://via.placeholder.com/150')}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <input type="file" onChange={handleImageChange} accept="image/*" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Email"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                  name="password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                  className="absolute inset-y-0 right-0 px-3 text-gray-600 focus:outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type="text"
                name="adresse"
                value={formData.adresse || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Address"
              />
              <input
                type="number"
                name="age"
                value={formData.age || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Age"
              />
              <input
                type="tel"
                name="numtelf"
                value={formData.numtelf || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Phone Number"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 text-white p-2 rounded ml-2">Cancel</button>
            </form>
          ) : (
            <>
              <div className="flex items-center space-x-6 mb-6">
                <img
                  src={user.profileImage ? `http://localhost:5000/${user.profileImage}` : 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">{user.email}</h2>
                  <p className="text-gray-600 capitalize">{user.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="User ID" value={user.id} />
                <InfoItem label="Email" value={user.email} />
                <InfoItem label="Address" value={user.adresse || 'Not provided'} />
                <InfoItem label="Age" value={user.age || 'Not provided'} />
                <InfoItem label="Phone" value={user.numtelf || 'Not provided'} />
                <InfoItem label="Role ID" value={user.roleId} />
                <InfoItem label="Account Status" value={user.blocked ? 'Blocked' : 'Active'} />
                <InfoItem label="Created At" value={new Date(user.createdAt).toLocaleDateString()} />
                <InfoItem label="Last Updated" value={new Date(user.updatedAt).toLocaleDateString()} />
              </div>
            </>
          )}
        </div>
        <div className="bg-gray-50 px-6 py-4">
          {!isEditing && (
            <button 
              className="bg-blue-500 text-white p-2 rounded"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ label, value }) => (
  <div className="flex justify-between p-4 border-b">
    <span className="font-medium text-gray-600">{label}:</span>
    <span className="text-gray-800">{value}</span>
  </div>
);

export default Users;
