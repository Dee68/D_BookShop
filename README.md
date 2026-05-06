# 📚 D-BookShop

## This is a full-stack Bookshop Management System built with:

- ### Frontend: React (Vite)
- ### Backend: Node.js + Express
- ### Database: SQLite
- ### Authentication: JWT
- ### File Uploads: Multer
- ### Architecture: REST API

---

## 🚀 Tech Stack

### Frontend
- React (Vite)
- JavaScript (ES6+)
- Fetch API
- Basic CSS (custom styling)

### Backend
- Node.js
- Express.js
- SQLite3
- dotenv
- REST API
- Multer (file uploads)
- bcrypt (password hashing)
- JWT (Authentication)

## 📁 Project Structure

```
D-BookShop/
│
├── backend/
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── database/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── layout/
│   │   ├── pages/
│   │   └── App.jsx
│   └── index.html
│
└── README.md
```

## ⚙️ Installation

```
npm install

▶️ Run the project

npm run dev


```
## 📡 API Endpoints
```
````
### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:id` | Get category by ID |
| POST | `/api/categories` | Create a new category |
| PUT | `/api/categories/:id` | Update a category |
| DELETE | `/api/categories/:id` | Delete a category |
```

```

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id`| Get product by ID |
| POST | `/api/products` | Create a new product |
|PUT | `/api/products/:id`| Update a product |
| DELETE | `/api/products/:id`| Delete a product |

````


````

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create a new order (transactional) |
| GET | `/api/orders/:user_id` | Get all orders for a user |
| PUT | `/api/orders/:id/cancel` | Cancel an order (restores stock) |
| DELETE | `/api/orders/:id` | Delete an order (optional/admin) |

````

````
### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users/register` | Create a new user |
| POST | `/api/users/login` | Login user |
| DELETE | `/api/users/:id` | Delete a user |

````
````

## 🔐 Business Rules
- Stock is reduced when an order is created
- Stock is restored when an order is cancelled
- Orders are transactional (safe against partial failure)
- Images are stored separately and linked via product_images table

````
````
## 🧪 API Testing (Postman)

A full Postman collection is included for testing all API endpoints.

### 📁 Location
`/docs/postman/BookShop_API.postman_collection.json`

### ▶️ How to use

1. Open Postman
2. Click **Import**
3. Select the JSON file
4. Set environment variables:

| Variable   | Value                     |
|------------|--------------------------|
| base_url   | http://localhost:3000     |
| token      | (auto-filled after login) |

### 🔐 Authentication

- Run `Login` request first
- Token is automatically saved using Postman scripts
- All protected routes use: Authorization: Bearer {{token}}