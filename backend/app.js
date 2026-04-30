const express = require('express');
const cors = require('cors');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get('/', (req, res) => {
    res.send('D-BookShop API is running...');
});

const categoryRoutes = require('./routes/categoryRoutes');

app.use('/api/categories', categoryRoutes);
const productRoutes = require('./routes/productRoutes');

app.use('/api/products', productRoutes);

module.exports = app;