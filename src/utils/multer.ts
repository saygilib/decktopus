import multer from 'multer';
import path from 'path';

// multer is a library for storing files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});


const multerConfig = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // i limited size to 1 mb , but it can be changed
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/; // supported formats
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  }
});

export default multerConfig;
