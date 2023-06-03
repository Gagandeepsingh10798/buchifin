const multer = require('multer')
const path = require('path')
const config = require('config')

const ImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let paths = path.resolve(__dirname, '../..' + config.get('PATHS').IMAGE.ACTUAL);
        cb(null, paths)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + `.${file.originalname.split('.').pop()}`)
    }
});
const ImageUpload = multer({
    storage: ImageStorage, fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})

const FileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let paths = path.resolve(__dirname, '../..' + config.get('PATHS').IMAGE.ACTUAL);
        cb(null, paths)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + `.${file.originalname.split('.').pop()}`)
    }
});
const FileUpload = multer({
    storage: FileStorage, fileFilter: (req, file, cb) => {
        if (file.mimetype === "pdf" || file.mimetype === "doc" || file.mimetype === "docx") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})


module.exports = {
    ImageUpload,
    FileUpload
};