const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage: storage });

router.post('/register' , upload.single('picture'), usersController.registerUser);
router.post('/login', usersController.login);

const updateStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Destination folder for storing profile pictures
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname +'-' + uniqueSuffix + extension);
  },
});

// Set up multer middleware
const update = multer({ storage: updateStorage });
router.put('/:userId', update.single('picture'), usersController.updateUserProfile);
router.get('/:userId', usersController.getSingleUser);
router.post('/updated-password', usersController.updatePassword);

module.exports = router;
