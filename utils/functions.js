const {Quiz,Question} = require('../models');

const removeQuestionFromQuizzes = async (quesId) => {
    Quiz.updateMany(
        {"questions.question":quesId},
        {$pull:{questions: {question:quesId} } }
    );
}

module.exports = {
    removeQuestionFromQuizzes,
}