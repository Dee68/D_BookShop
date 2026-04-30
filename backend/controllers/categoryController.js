const Category = require('../models/categoryModel');

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.getAllCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Category name is required" });
        }

        const result = await Category.createCategory(name);
        res.status(201).json(result);
    } catch (error) {
        if (error.message.includes("UNIQUE")) {
            return res.status(400).json({ error: "Category already exists" });
}
        res.status(500).json({ error: error.message });
    }
};