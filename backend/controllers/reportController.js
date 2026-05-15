const Product = require("../models/productModel");
const PDFDocument = require("pdfkit");

exports.inventoryTextReport = async (req, res) => {

    try {

        const products = await Product.getAllProducts();

        let report = "";

        report += "D-BookShop Inventory Report\n";
        report += "============================\n\n";

        products.forEach(product => {

            report += `
ID: ${product.id}
Title: ${product.title}
Price: €${product.price}
Stock: ${product.stock}
Category: ${product.category_name || "N/A"}
----------------------------------------
`;
        });

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=inventory-report.txt"
        );

        res.setHeader("Content-Type", "text/plain; charset=utf-8");

        res.status(200).send(report);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
};

exports.inventoryPdfReport = async (req, res) => {

    try {

        const products = await Product.getAllProducts(); 

        const doc = new PDFDocument({
            margin: 40
        });

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=inventory-report.pdf"
        );

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        doc.pipe(res);

        doc
            .fontSize(20)
            .text("D-BookShop Inventory Report", {
                align: "center"
            });

        doc.moveDown();

        products.forEach(product => {

            doc
                .fontSize(12)
                .text(`ID: ${product.id}`);

            doc.text(`Title: ${product.title}`);

            doc.text(`Price: €${product.price}`);

            doc.text(`Stock: ${product.stock}`);

            doc.text(
                `Category: ${product.category_name || "N/A"}`
            );

            doc.moveDown();
        });

        doc.end();

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
};

exports.inventoryCsvReport = async (req, res) => {

    try {

        const products = await Product.getAllProducts();

        let csv = "";

        // HEADERS
        csv += "ID,Title,Price,Stock,Category\n";

        // ROWS
        products.forEach(product => {

            csv += `${product.id},"${product.title}",${product.price},${product.stock},"${product.category_name || "N/A"}"\n`;

        });

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=inventory-report.csv"
        );

        res.setHeader(
            "Content-Type",
            "text/csv"
        );

        res.status(200).send(csv);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
};