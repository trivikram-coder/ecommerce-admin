import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import Form from './Pages/Form'
import Dashboard from './Pages/Dashboard'
import Products from './Pages/Products'
const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
    <Routes>
      <Route path="/" element={<Form />} />
    
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/products' element={<Products/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
