const multer = require('multer');
const path = require("path");


const maxSize = 1 * 1024 * 1024;

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.resolve('uploads'));
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Image uploaded should be jpg/jpeg or png"), false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: maxSize }
});

module.exports = upload;