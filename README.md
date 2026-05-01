# 📚 D-BookShop

A simple full-stack bookshop backend built with Node.js, Express, and SQLite.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- SQLite3
- dotenv
- REST API
- Multer (file uploads)

## 📁 Project Structure

```
D-BookShop/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── categoryController.js
│   ├── models/
│   │   └── categoryModel.js
│   ├── routes/
│   │   └── categoryRoutes.js
│   ├── database/
│   │   └── bookshop.db
│   ├── app.js
│   └── server.js
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── pages/
│   └── assets/
│
├── .env
├── .gitignore
├── package.json
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
## 🧪 Testing Tool
Postman