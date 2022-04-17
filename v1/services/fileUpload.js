const multer = require('multer')
const path = require('path')
const config = require('config')

const AdminProfilePicStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let paths = path.resolve(__dirname, '../..' + config.get('PATHS').IMAGE.ADMIN.ACTUAL);
        cb(null, paths)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + `.${file.originalname.split('.').pop()}`)
    }
});
const AdminProfilePicUpload = multer({
    storage: AdminProfilePicStorage, fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})

const AppCategoryIconStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let paths = path.resolve(__dirname, '../..' + config.get('PATHS').IMAGE.APP_CATEGORY.ACTUAL);
        cb(null, paths)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + `.${file.originalname.split('.').pop()}`)
    }
});
const AppCategoryIconUpload = multer({
    storage: AppCategoryIconStorage, fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})

const DriverProfilePicStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let paths = path.resolve(__dirname, '../..' + config.get('PATHS').IMAGE.DRIVER.ACTUAL);
        cb(null, paths)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + `.${file.originalname.split('.').pop()}`)
    }
});
const DriverProfilePicUpload = multer({
    storage: DriverProfilePicStorage, fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})

const DriverDocumentsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let paths = path.resolve(__dirname, '../..' + config.get('PATHS').FILE.DRIVER.ACTUAL);
        cb(null, paths)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + `.${file.originalname.split('.').pop()}`)
    }
});
const DriverDocumentsUpload = multer({
    storage: DriverDocumentsStorage, fileFilter: (req, file, cb) => {
        console.log({ file: req.files });
        if (file.mimetype == "application/pdf" || file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg .pdf format allowed!'));
        }
    }
})

const FuelCategoryPicStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let paths = path.resolve(__dirname, '../..' + config.get('PATHS').IMAGE.FUEL_CATEGORY.ACTUAL);
        cb(null, paths)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + `.${file.originalname.split('.').pop()}`)
    }
});
const FuelCategoryPicUpload = multer({
    storage: FuelCategoryPicStorage, fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})
module.exports = {
    AppCategoryIconUpload: AppCategoryIconUpload,
    DriverProfilePicUpload: DriverProfilePicUpload,
    DriverDocumentsUpload: DriverDocumentsUpload,
    AdminProfilePicUpload: AdminProfilePicUpload,
    FuelCategoryPicUpload: FuelCategoryPicUpload
};