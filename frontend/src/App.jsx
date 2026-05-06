import { useState, useEffect, useContext } from "react";
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

export default function App() {
    const { token } = useContext(AuthContext);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     setLoading(false);
    // }, []);

    // if (loading) return <div>Loading...</div>;

    // if (!token) {
    //     return <Login onLogin={() => {}} />;
    // }

    // return <AdminLayout />;
    return (
            <Routes>

                {/* PUBLIC STORE */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>} />

                {/* LOGIN */}
                <Route path="/login" element={<Login />} />
                <Route path="/checkout" element={<Checkout />} />
                

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
                <Route path="orders/:id" element={<OrderDetails />} />
                
                </Route>

            </Routes>
    );
}