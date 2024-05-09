const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contact');

router.post('/', contactsController.addContact);

module.exports = router;
