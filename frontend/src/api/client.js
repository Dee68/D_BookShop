const BASE_URL = "http://localhost:3000/api";

export async function apiRequest(endpoint, method = "GET", body, token) {
    const res = await fetch(BASE_URL + endpoint, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : ""
        },
        body: body ? JSON.stringify(body) : undefined
    });

    return res.json();
}

export async function apiUpload(endpoint, formData, token) {
    const res = await fetch("http://localhost:3000/api" + endpoint, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
            //DO NOT set Content-Type (browser sets it for FormData)
        },
        body: formData
    });

    return res.json();
}