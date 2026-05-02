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