const express = require('express');
const cors = require('cors');

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static('frontend/assets/images'));
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large (max 2MB)' });
    }
    res.status(500).json({ error: err.message });
});
// test route
app.get('/', (req, res) => {
    res.send('D-BookShop API is running...');
});

const userRoutes = require('./routes/userRoutes');

app.use('/api/users', userRoutes);

const categoryRoutes = require('./routes/categoryRoutes');

app.use('/api/categories', categoryRoutes);

const productRoutes = require('./routes/productRoutes');

app.use('/api/products', productRoutes);

module.exports = app;