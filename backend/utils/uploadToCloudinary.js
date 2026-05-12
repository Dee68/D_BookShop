const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (fileBuffer, folder = "bookshop") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        stream.end(fileBuffer);
    });
};

module.exports = uploadToCloudinary;