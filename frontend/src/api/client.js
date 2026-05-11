import { toast } from "react-toastify";
const BASE_URL = "http://localhost:3000/api";

function handleAuth(res) {
    if (res.status === 401) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
        return true;
    }
    return false;
}

export async function apiRequest(endpoint, method = "GET", body, token) {
    const res = await fetch(BASE_URL + endpoint, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : ""
        },
        body: body ? JSON.stringify(body) : undefined
    });

    if (handleAuth(res)) return;

    return res.json();
}

// export async function apiUpload(endpoint, formData, token, method="POST") {
//     const res = await fetch("http://localhost:3000/api" + endpoint, {
//         method,
//         headers: {
//             Authorization: `Bearer ${token}`
            
//         },
//         body: formData
//     });

//     if (handleAuth(res)) return;
//     return res.json();
// }
export async function apiUpload(endpoint, formData, token, method = "POST") {
    const res = await fetch("http://localhost:3000/api" + endpoint, {
        method,
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });

    const data = await res.text(); // for debugging

    if (!res.ok) {
        console.error("UPLOAD ERROR:", data);
        throw new Error(data);
    }

    return JSON.parse(data);
}