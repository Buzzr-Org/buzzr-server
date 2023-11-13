const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');

router.post('/login', userController.login);
router.post('/email', userController.email);
router.post('/signup', userController.signup);

module.exports = router;