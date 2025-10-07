import { ShoppingBag, User, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({ name: '', email: '' });
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(false);
 const[users,setUsers]=useState([])
 
  const initialFormState = {
    id: '',
    title: '',
    price: '',
    discountPrice: '',
    description: '',
    category: '',
    image: '',
    rating: '',
    quantity: 1,
  };
  const [form, setForm] = useState(initialFormState);

  // Get admin data from localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('adminData'));
    if (!data) {
      toast.error("Session expired. Please login again.");
      navigate('/');
    } else {
      setAdmin(data);
    }
  }, [navigate]);



  
  const handleSignOut = () => {
    localStorage.removeItem("adminData");
    toast.info("Logged out");
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary text-center">
        Vk Store Admin Dashboard <ShoppingBag size={30} />
      </h2>

      {/* Admin Info */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title text-success">Admin Info</h5>
          <p><strong>Name:</strong> {admin.name}</p>
          <p><strong>Email:</strong> {admin.email}</p>
          <button className="btn btn-danger" onClick={handleSignOut}>Sign out</button>
        </div>
      </div>

      {/* Add or Update Product Form */}
   
  <div className="card mb-4 mt-4 shadow-lg border-0" style={{ borderRadius: "15px" }}>
    <div className="card-body d-flex flex-column align-items-center justify-content-center bg-primary text-white" style={{ borderRadius: "15px" }}>
      <h5 className="card-title mb-3 fw-bold">📦 Products Data</h5>
       <Link to="/products" style={{ textDecoration: "none" }} className="btn btn-light text-primary fw-semibold px-4 py-2 rounded-pill shadow-sm">
        Open
        </Link>
      
    </div>
  </div>
<div className="card mb-4 mt-4 shadow-lg border-0" style={{ borderRadius: "15px" }}>
    <div className="card-body d-flex flex-column align-items-center justify-content-center bg-success text-white" style={{ borderRadius: "15px" }}>
      <h5 className="card-title mb-3 fw-bold"><Users size={18}/> Users data</h5>
       <Link to="/users" style={{ textDecoration: "none" }} className="btn btn-light text-primary fw-semibold px-4 py-2 rounded-pill shadow-sm">
        Open
        </Link>
      
    </div>
  </div>

     
    
    </div>
  );
};

export default Dashboard;
