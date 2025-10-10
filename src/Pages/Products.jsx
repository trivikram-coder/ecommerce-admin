import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShoppingBag } from "lucide-react";
const Products = () => {
  const initialFormState = {
    id: "",
    title: "",
    price: "",
    discountPrice: "",
    description: "",
    category: "",
    image: "",
    rating: "",
    quantity: "",
  };

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editing, setEditing] = useState(false);
  const[filtered,setFiltered]=useState([])
  const[name,setName]=useState('');
  useEffect(() => {
    axios
      .get("https://spring-server-0m1e.onrender.com/products/get", {
        withCredentials: true,
      })
      .then((res) => {
        setProducts(res.data)
        setFiltered(res.data)
      }
    )
      .catch(() => toast.error("Error fetching products"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleSearch=(name)=>{
    const results=name===''?filtered:filtered.filter((item)=> item.title.toLowerCase().includes(name.toLowerCase()))
    setProducts(results)
  }
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
      const res = await axios.post(
        "https://spring-server-0m1e.onrender.com/products/add",
        newProduct
      );
      setProducts([...products, res.data]); // fixed here
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
      await axios.put(
        `https://spring-server-0m1e.onrender.com/products/update/${form.id}`,
        form
      );
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
      await axios.delete(
        `https://spring-server-0m1e.onrender.com/products/delete/${id}`
      );
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <>
      {/* Form */}
      <h2 className="mb-4 text-primary text-center">
       Products data <ShoppingBag size={30} />
      </h2>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">
            {editing ? "Update Product" : "Add Product"}
          </h5>
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
{/* Search Bar */}
<div
  className="search-bar-container d-flex align-items-center justify-content-center mb-4"
>
  <div className="search-box d-flex align-items-center gap-2 shadow-sm p-2 rounded-4 bg-white">
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSearch(name);
      }}
      className="form-control border-0 shadow-none fs-5"
      placeholder="🔍 Search for products..."
      style={{ width: "400px", background: "transparent" }}
    />
    <button
      className="btn btn-success px-4 rounded-3 fw-semibold"
      onClick={() => handleSearch(name)}
      type="button"
    >
      Search
    </button>
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
                  <th>Id</th>
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
                      <td>{p.id}</td>
                      <td>{p.title}</td>
                      <td>₹{p.price}</td>
                      <td>₹{p.discountPrice}</td>
                      <td>{p.category}</td>
                      <td>{p.quantity}</td>
                      <td>
                        {p.image ? (
                          <img src={p.image} alt="product" width="50" />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEdit(p)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(p.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
