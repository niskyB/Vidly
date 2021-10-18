const multer = require('multer');

const maxSize = 1 * 1080 * 1080;

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimtype === "image/jpg" || file.mimtype === "image/jpeg" || file.mimtype === "image/png") {
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

exports.upload = upload;