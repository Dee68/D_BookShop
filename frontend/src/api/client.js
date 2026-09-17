import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

async function handleAuth(res) {

    // Login failures should be handled by the login component,
    // not treated as an expired session.
    const isLoginRequest = res.url.includes("/login");

    if (res.status === 401 && !isLoginRequest) {

        localStorage.removeItem("token");

        toast.error("Session expired. Please log in again.");

        window.location.href = "/login";

        return true;
    }

    return false;
}

export async function apiRequest(
    endpoint,
    method = "GET",
    body,
    token
) {

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token && {
                Authorization: `Bearer ${token}`
            })
        },
        body: body ? JSON.stringify(body) : undefined
    });

    if (await handleAuth(res)) {
        return;
    }

    const data = await res.json();

    return data;
}

export async function apiUpload(
    endpoint,
    formData,
    token,
    method = "POST"
) {

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
            ...(token && {
                Authorization: `Bearer ${token}`
            })
        },
        body: formData
    });

    if (await handleAuth(res)) {
        return;
    }

    const data = await res.text();

    if (!res.ok) {
        console.error("UPLOAD ERROR:", data);
        throw new Error(data);
    }

    return JSON.parse(data);
}