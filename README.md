# 📚 D-BookShop

A simple full-stack bookshop backend built with Node.js, Express, and SQLite.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- SQLite3
- dotenv
- REST API

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

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:id` | Get category by ID |
| POST | `/api/categories` | Create a new category |
| PUT | `/api/categories/:id` | Update a category |
| DELETE | `/api/categories/:id` | Delete a category |
```