const Product = require('../models/productModel');
const { deleteFile } = require('../utils/fileHelper');
const { getPagination } = require('../utils/pagination');



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
        const { page, limit, offset } = getPagination(req);

        const filters = {
            search: req.query.search,
            category: req.query.category,
            minPrice: req.query.minPrice,
            maxPrice: req.query.maxPrice,
            limit,
            offset
        };

        const products = await Product.getFilteredProducts(filters);
        const total = await Product.countFilteredProducts(filters);

        res.json({
            data: products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

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
        const id = req.params.id;

        // get existing product images
        const existingProduct = await Product.getProductById(id);

        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        const newImages = req.files?.map(file => `/images/${file.filename}`) || [];

        // update DB
        const result = await Product.updateProduct(id, req.body, newImages);

        // delete old images ONLY if new ones uploaded
        if (newImages.length > 0) {
            existingProduct.images.forEach(img => {
                deleteFile(img);
            });
        }

        res.json({ message: "Product updated" });
        console.log("FILES RECEIVED:", req.files?.length);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await Product.getProductById(id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // delete images from disk
        product.images.forEach(img => {
            deleteFile(img);
        });

        await Product.deleteProduct(id);

        res.json({ message: "Product deleted" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

