const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../utils/s3Config");

const isS3Configured = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_ACCESS_KEY_ID !== 'dummy-id';

let storage;

if (isS3Configured) {
  storage = multerS3({
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
  });
} else {
  storage = multer.memoryStorage();
  console.warn("AWS S3 is not configured. Falling back to memory storage. Avatars will not be saved permanently.");
}

const upload = multer({ storage });

module.exports = { upload };