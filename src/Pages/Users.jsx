import React, { useState, useEffect } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

useEffect(() => {
  
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn('No token found in localStorage');
    setLoading(false); // stop loading even if no token
    return;
  }

  fetch('https://spring-server-0m1e.onrender.com/admin/allusers', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    })
    .then((data) => setUsers(data))
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false)); // ✅ this line is important
}, []);


console.log(users)
  return (
    <div className="users-container">
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <h4 className="card-title text-center mb-4 fw-bold text-success">
            👥 Users List
          </h4>

          {loading ? (
            <p className="text-center text-secondary fs-5">Loading users...</p>
          ) : error ? (
            <p className="text-center text-danger fs-5">{error}</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-success">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Father Name</th>
                    <th>Date of Birth</th>
                    <th>Mobile</th>
                    <th>Address</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td className="fw-semibold">{u.name}</td>
                        <td>{u.fatherName}</td>
                        <td>{u.dob}</td>
                        <td>{u.mobileNumber}</td>
                        <td>{u.address}</td>
                        <td>{u.email}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted fs-5 py-3">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
