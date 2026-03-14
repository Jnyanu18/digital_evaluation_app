const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../utils/s3Config");

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueFileName = `${Date.now()}-${file.originalname}`;
      console.log("Generated file name:", uniqueFileName); // Log the file name
      cb(null, uniqueFileName);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: 'inline', // Set Content-Disposition to inline
  }),
});

module.exports = { upload };