import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./styles/global.css";
import App from './App.jsx'
import AuthProvider from "./auth/AuthContext";
import { BrowserRouter } from "react-router-dom";
import  CartProvider  from './context/CartContext.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


createRoot(document.getElementById('root')).render(
  <>
  <AuthProvider>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </AuthProvider>
  <ToastContainer position="top-right" autoClose={3000} />
  </>
)
