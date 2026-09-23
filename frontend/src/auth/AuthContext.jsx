import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));

    const login = (jwt) => {
        localStorage.setItem("token", jwt);
        setToken(jwt);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

   
    let user = null;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            user = {
                id: decoded.id,
                name: decoded.name,
                email: decoded.email,
                role: decoded.role,
            };
        } catch {
            // Malformed/expired token in localStorage — treat as logged out
            user = null;
        }
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout, setToken }}>
            {children}
        </AuthContext.Provider>
    );
}