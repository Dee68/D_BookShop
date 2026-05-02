const fs = require('fs');
const path = require('path');

exports.deleteFile = (filePath) => {
    try {
        const fullPath = path.join(__dirname, '..', filePath);

        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    } catch (error) {
        console.error("File delete error:", error.message);
    }
};