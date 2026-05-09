const express = require('express');
const cors = require('cors');

const app = express();
const path = require('path');

// middleware
//app.use(cors());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
//app.use('/images', express.static(path.join(process.cwd(),"uploads/images")));
app.use('/images', express.static(path.resolve(__dirname,"uploads/images")));

console.log("Serving images from:", path.join(__dirname,"uploads/images"));


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

const orderRoutes = require('./routes/orderRoutes');

app.use('/api/orders', orderRoutes);

const contactRoutes = require("./routes/contactRoutes");

app.use("/api/contact", contactRoutes);

const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

const adminRoutes = require('./routes/adminRoutes');

app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large (max 5MB)' });
    }
    res.status(500).json({ error: err.message });
});



module.exports = app;