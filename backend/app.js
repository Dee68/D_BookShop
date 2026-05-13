const cors = require('cors');
const express = require('express');

const app = express();
const path = require('path');

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.CLIENT_URL
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
    
}));

// app.use(cors({
//     origin: [
//         "http://localhost:5173",
//         "http://localhost:3000",
//         process.env.CLIENT_URL],
//     credentials: true
// }));
app.use(express.json());
// //app.use('/images', express.static(path.join(process.cwd(),"uploads/images")));
// app.use('/images', express.static(path.resolve(__dirname,"uploads/images")));

//console.log("Serving images from:", path.join(__dirname,"uploads/images"));


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
if (process.env.NODE_ENV !== "production") {
    console.log("Serving images from:", path.join(__dirname,"uploads/images"));
}

app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large (max 5MB)' });
    }
    res.status(500).json({ error: err.message });
});



module.exports = app;