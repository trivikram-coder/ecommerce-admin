import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom';
import {ShoppingBag} from 'lucide-react'
import { toast } from 'react-toastify';
const Form = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [resMessage, setResMessage] = useState("");
  
  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("https://backend-server-3-ycun.onrender.com/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success("Sign in successfully")
       
        localStorage.setItem("adminData",JSON.stringify(data));
        
        navigate("/dashboard")
        if (rememberMe) {
          localStorage.setItem("adminToken", data.token);
        } else {
          sessionStorage.setItem("adminToken", data.token);
        }
        // Redirect if needed
        // navigate("/admin/dashboard");
      } else {
        toast.error("Failed to sign in")
        setResMessage(data.message || "Login failed ❌");
      }

    } catch (error) {
      console.error("Login Error:", error);
      setResMessage("Something went wrong. Try again later.");
    }
  };

  return (
 <>
  <header className='text-center mb-3'>
        <strong className='text text-primary' style={{fontSize:60}}>Vk Store
          <ShoppingBag size={40}/>
        </strong>
        
      </header>
        <h3 className="text-center mb-4 text text-danger">Admin Sign In</h3>
    <div className="container d-flex justify-content-center align-items-center min-vh-90">
     
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
      
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "🔒" : "👁️"}
              </button>
            </div>
            {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
          </div>

          {resMessage && (
            <div className={`alert ${resMessage.includes("successful") ? 'alert-success' : 'alert-danger'}`} role="alert">
              {resMessage}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100">Sign In</button>
        </form>
      </div>
    </div>
    </>
  );
};

export default Form;
