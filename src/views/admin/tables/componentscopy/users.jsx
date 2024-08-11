import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/auth/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [token]);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/auth/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(error => {
        setError(error.message);
      });
  };

  const handleUpdate = (id) => {
    // Update logic here
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  const handleBlockUser = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:5000/auth/block/${id}`);
      console.log(response.data.message);
      // Refresh the list or update the user status in the UI
    } catch (error) {
      console.error('Error blocking/unblocking user:', error.response.data.message);
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">User Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div 
            key={user.id} 
            className="bg-white rounded-lg shadow-lg p-4 transform transition duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="flex flex-col items-center mb-4">
              <img
                src={user.profileImage ? `http://localhost:5000/${user.profileImage}` : '/default-profile.png'}
                alt={user.email}
                className="w-20 h-20 rounded-full object-cover mb-4 border border-gray-200"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-1">{user.role}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="flex justify-end space-x-2">
              {user.role === 'admin' ? (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                  onClick={() => handleUpdate(user.id)}
                >
                  Update
                </button>
              ) : (
                <>
                 <button onClick={() => handleBlockUser(user.id)}>
  {user.blocked ? 'Unblock' : 'Block'}
</button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;
