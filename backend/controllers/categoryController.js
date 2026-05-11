const Category = require('../models/categoryModel');

exports.getCategories = async (req, res) => {

    try {
 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const result = await Category.getAllCategories(page, limit);
        const pages = Math.ceil(result.total / limit);

         res.json({
            data: result.data,
            pagination: {
                page,
                limit,
                total: result.total,
                pages: pages
            }
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};

exports.getStoreCategories = async (req, res) => {

    try {

        const categories =
            await Category.getCategoriesForStore();

        res.json(categories);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
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
        if (error.code === "23505") {
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