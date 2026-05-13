const Product = require('../models/productModel');
const { deleteFile } = require('../utils/fileHelper');
const { getPagination } = require('../utils/pagination');
const uploadToCloudinary = require("../utils/uploadToCloudinary");

function normalizeProductFilters(query, pagination) {
    const toNumber = (v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    };

    return {
        search: query.search?.trim() || null,
        category: toNumber(query.category),
        minPrice: toNumber(query.minPrice),
        maxPrice: toNumber(query.maxPrice),
        limit: pagination.limit,
        offset: pagination.offset
    };
}


exports.createProduct = async (req, res) => {
    try {
        const { title, author, price, category_id, stock } = req.body;

        // VALIDATION FIRST
        if (!title || !price) {
            return res.status(400).json({ error: "Title and price required" });
        }

        // const images = req.files?.length
        //     ? req.files.map(file => `/images/${file.filename}`)
        //     : [];
        const uploadedImages = [];

        if (req.files?.length) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(file.buffer, "products");
                uploadedImages.push(result.secure_url);
            }
        }

        const result = await Product.createProduct({
            title,
            author,
            price,
            category_id,
            stock,
            images:uploadedImages
        });

        res.status(201).json({
            message: "Product created",
            productId: result.id   // FIXED
        });

    } catch (error) {
        console.error("CREATE PRODUCT ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};
exports.getProducts = async (req, res) => {
    try {
        const { page, limit, offset } = getPagination(req);

        // const filters = {
        //     search: req.query.search,
        //     category: req.query.category,
        //     minPrice: req.query.minPrice,
        //     maxPrice: req.query.maxPrice,
        //     limit,
        //     offset
        // };
        const filters = normalizeProductFilters(req.query, { limit, offset });
        // const filters = {
        //     search: req.query.search,
        //     category: req.query.category ? Number(req.query.category) : null,
        //     minPrice: req.query.minPrice ? Number(req.query.minPrice) : null,
        //     maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : null,
        //     limit,
        //     offset
        // };

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
        console.error("PRODUCT ERROR:", error); 
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

        //const newImages = req.files?.map(file => `/images/${file.filename}`) || [];
        const uploadedImages = [];

        if (req.files?.length) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(file.buffer, "products");
                uploadedImages.push(result.secure_url);
            }
        }

        // update DB
        //const result = await Product.updateProduct(id, req.body, newImages);
        const result = await Product.updateProduct(id, req.body, uploadedImages);

        // delete old images ONLY if new ones uploaded locally
        // if (newImages.length > 0) {
        //     existingProduct.images.forEach(img => {
        //         deleteFile(img);
        //     });
        // }

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

