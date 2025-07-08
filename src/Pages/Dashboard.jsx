import { ShoppingBag } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({ name: '', email: '' });
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(false);
 
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

  // Fetch all products
  useEffect(() => {
    axios
      .get('https://spring-server-0m1e.onrender.com/products/get')
      .then((res) => setProducts(res.data))
      .catch((err) => toast.error("Error fetching products"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const newProduct = {
      ...form,
      id: parseInt(form.id),
      price: parseFloat(form.price),
      discountPrice: parseFloat(form.discountPrice),
      rating: parseFloat(form.rating),
      quantity: parseInt(form.quantity),
    };
    try {
      const res = await axios.post('https://spring-server-0m1e.onrender.com/products/add', newProduct);
      setProducts([...products, ...res.data]);
      toast.success("Product added successfully!");
      setForm(initialFormState);
    } catch (err) {
      toast.error("Failed to add product");
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://spring-server-0m1e.onrender.com/products/update/${form.id}`, form);
      setProducts(products.map((p) => (p.id === form.id ? form : p)));
      toast.success("Product updated successfully!");
      setForm(initialFormState);
      setEditing(false);
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://spring-server-0m1e.onrender.com/products/delete/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

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
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{editing ? "Update Product" : "Add Product"}</h5>
          <form onSubmit={editing ? handleUpdate : handleAdd}>
            <div className="row">
              {[
                { label: "Id", name: "id", type: "number" },
                { label: "Title", name: "title" },
                { label: "Price", name: "price", type: "number" },
                { label: "Discount Price", name: "discountPrice", type: "number" },
                { label: "Description", name: "description" },
                { label: "Category", name: "category" },
                { label: "Image URL", name: "image" },
                { label: "Rating", name: "rating", type: "number" },
                { label: "Quantity", name: "quantity", type: "number" },
              ].map(({ label, name, type = "text" }) => (
                <div className="col-md-4 mb-3" key={name}>
                  <label className="form-label">{label}</label>
                  <input
                    type={type}
                    name={name}
                    className="form-control"
                    value={form[name]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
            </div>
            <button type="submit" className="btn btn-primary me-2">
              {editing ? "Update" : "Add"}
            </button>
            {editing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditing(false);
                  setForm(initialFormState);
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Product Table */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Product List</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((p, index) => (
                    <tr key={p.id}>
                      <td>{index + 1}</td>
                      <td>{p.title}</td>
                      <td>${p.price}</td>
                      <td>${p.discountPrice}</td>
                      <td>{p.category}</td>
                      <td>{p.quantity}</td>
                      <td>
                        {p.image ? <img src={p.image} alt="product" width="50" /> : "N/A"}
                      </td>
                      <td>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="8" className="text-center">No products found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
