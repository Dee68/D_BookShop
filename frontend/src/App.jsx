import { useContext } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Categories from "./pages/Categories";
import AdminLayout from "./layout/AdminLayout";
import { AuthContext } from "./auth/AuthContext";
import Home from "./pages/HomePage";
import Checkout from "./pages/Checkout";
import ProtectedRoute  from "./components/ProtectedRoute";
import OrderDetails from "./pages/OrderDetails";
import OrderSuccess from "./pages/OrderSuccess";
import CustomerOrders from "./pages/CustomerOrders";
import ProductDetails from "./pages/ProductDetails";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import StoreLayout from "./layout/StoreLayout";

export default function App() {
    const { token } = useContext(AuthContext);
    
    return (
            <Routes>

                {/* PUBLIC STORE */}
                <Route element={<StoreLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route
                        path="/my-orders"
                        element={
                            <ProtectedRoute>
                                <CustomerOrders />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/checkout" element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>} 
                    />

                    <Route path="/order-success/:id" element={
                        <ProtectedRoute>
                            <OrderSuccess />
                        </ProtectedRoute>} 
                    />
                    
                    <Route path="/orders/:id" element={
                        <ProtectedRoute>
                            <OrderDetails />
                        </ProtectedRoute>} 
                    />
                </Route>
                

                {/* ADMIN (protected UI still controlled inside layout) */}
                <Route
                    path="/admin/*"
                    element={ 
                        <ProtectedRoute>
                             <AdminLayout />
                        </ProtectedRoute>
                    }>

                         {/* CHILD ROUTES */}
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="users" element={<Users />} />
                    <Route path="orders" element={<Orders />} />
                
                
                
                </Route>

            </Routes>
    );
}