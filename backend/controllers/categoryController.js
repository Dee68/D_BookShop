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

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.getCategoryById(req.params.id);

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const result = await Category.updateCategory(req.params.id, name);

        if (result.changes === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json({ message: "Category updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const result = await Category.deleteCategory(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json({ message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};