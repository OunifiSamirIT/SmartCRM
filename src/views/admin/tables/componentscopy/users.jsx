import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token'); // Get the token from local storage

  useEffect(() => {
    axios.get('http://localhost:5000/auth/', {
      headers: {
        Authorization: `Bearer ${token}` // Include the token in the request headers
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
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/auth/${id}`, {
      headers: {
        Authorization: `Bearer ${token}` // Include the token in the request headers
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => (
          <div key={user.id} className="bg-white rounded shadow-md p-4">
            <h2 className="text-lg font-bold mb-2">{user.role}</h2>
            <p className="text-gray-600 mb-2">{user.email}</p>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleUpdate(user.id)}
              >
                Update
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;