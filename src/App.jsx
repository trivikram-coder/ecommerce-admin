import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import ProductAdd from './Pages/ProductAdd'
import Form from './Pages/Form'
import Dashboard from './Pages/Dashboard'
const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
    <Routes>
      <Route path="/" element={<Form />} />
      <Route path="/product" element={<ProductAdd />} />
      <Route path='/dashboard' element={<Dashboard/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
