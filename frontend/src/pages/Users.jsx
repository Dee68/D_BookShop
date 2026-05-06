import { useEffect, useState } from "react";

export default function Users() {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem("token");

    async function loadUsers() {
        const res = await fetch("http://localhost:3000/api/users", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();
        setUsers(data);
    }

    useEffect(() => {
        loadUsers();
    }, []);

    // PROMOTE / DEMOTE
    async function changeRole(id, role) {
        await fetch(`http://localhost:3000/api/users/${id}/role`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ role })
        });
        //console.log("CLICKED:", id, role);

        loadUsers();
    }

    // DELETE
   async function deleteUser(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");

    if (!confirmDelete) return;

    await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    loadUsers();
}

    return (
        <div style={{ padding: 20 }}>
            <h2>Users</h2>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                {user.role !== "admin" ? (
                                    <button
                                        onClick={() => changeRole(user.id, "admin")}
                                    >
                                        Promote
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => changeRole(user.id, "customer")}
                                    >
                                        Demote
                                    </button>
                                )}

                                <button onClick={() => deleteUser(user.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}