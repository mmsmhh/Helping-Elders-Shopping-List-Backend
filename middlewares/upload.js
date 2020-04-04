const multer = require('multer');
const multerS3 = require('multer-s3')
const randomize = require('randomatic');
const config = require('../configurations');
const { S3 } = require('../utils/aws');

const fileFilter = (req, file, cb) => {

    if (file.mimetype.match('image.*')) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};

const generateFileName = (file) => {
    return file.fieldname + '-' + randomize('0', 6) + '-' + Date.now() +
        '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
}

const upload = multer({
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 20
    },
    storage: multerS3({
        s3: S3,
        bucket: config.S3_BUCKET_NAME,
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, generateFileName(file))
        }
    })
})


module.exports = {
    uploadImage: (fileName) => {
        return upload.single(fileName);
    },
    uploadImages: (fileName, maxNumber) => {
        return upload.array(fileName, maxNumber);
    }
}