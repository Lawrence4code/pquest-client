const multer = require('multer');

// allowed image formats
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg'
}

// image storage and multer configs
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error  = new Error('Invalid mime type');
        if(isValid) {
            error = null;
        }
        cb(null, "backend/images")
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-'+ Date.now() + "." + ext);
    }
});

module.exports = multer({storage}).single('image');