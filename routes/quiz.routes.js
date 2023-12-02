const express = require('express');
const router = express.Router();

const { quizController } = require('../controllers');
const auth = require('../middleware/auth');

router.get('/all', quizController.getQuizzes);
router.get('/:quizId', quizController.getQuiz);

// All routes protected below this
router.use(auth);
router.post('/question/create', quizController.createQuestion);
router.route('/question/:quesId')
    .put(quizController.updateQuestion)
    .delete(quizController.deleteQuestion);
router.post('/create', quizController.createQuiz);
router.delete('/:quizId/removeQuestion', quizController.removeQuizQuestion);
router.put('/:quizId/addQuestion', quizController.addQuizQuestion);
router.delete('/:quizId', quizController.deleteQuiz);
module.exports = router;