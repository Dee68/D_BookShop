import { createContext, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));

    // useEffect(() => {
    //     const saved = localStorage.getItem("token");
    //     if (saved) {
    //         setToken(saved);
    //     }
    // }, []);

    const login = (jwt) => {
        localStorage.setItem("token", jwt);
        setToken(jwt);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}