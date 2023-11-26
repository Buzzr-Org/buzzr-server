const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
const auth = require('../middleware/auth');

router.post('/login', userController.login);
router.post('/email', userController.email);
router.post('/signup', userController.signup);

router.use(auth);
router.get('/checkValidToken', userController.checkValidToken);
router.get('/myquestions', userController.myQuestions);
router.get('/myquizzes', userController.myQuizzes);

module.exports = router;