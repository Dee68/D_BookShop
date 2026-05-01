const Product = require('../models/productModel');

exports.createProduct = async (req, res) => {
    try {
        const { title, author, price, category_id, stock } = req.body;

        // extract uploaded files
        //const images = req.files.map(file => `/images/${file.filename}`);
        // handle optional images safely
        const images = req.files && req.files.length > 0
            ? req.files.map(file => `/images/${file.filename}`)
            : [];

        const result = await Product.createProduct({
            title,
            author,
            price,
            category_id,
            stock,
            images
        });

        res.status(201).json({message: "Product created",productId: result.id});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        
        const images = req.files?.map(file => `/images/${file.filename}`) || [];
        const result = await Product.updateProduct(req.params.id, req.body,images);
        if (result.changes === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Product updated" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const result = await Product.deleteProduct(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};