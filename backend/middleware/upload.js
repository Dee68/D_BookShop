// const multer = require('multer');
// const fs = require("fs");

// const path = require('path');

// const uploadPath = path.join(__dirname, "../uploads/images");

// if (!fs.existsSync(uploadPath)) {
//     fs.mkdirSync(uploadPath, { recursive: true });
// }
// // storage config
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + "-" + file.originalname);
//     }
// });

// // file filter (optional but recommended)
// const fileFilter = (req, file, cb) => {
//     const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
//     if (allowed.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only images are allowed'), false);
//     }
// };

// const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024, files: 5 } // 5MB per file
// });


// module.exports = upload;

const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = upload;