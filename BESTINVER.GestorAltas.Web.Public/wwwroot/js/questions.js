'use strict';

function CustomQuestionBehabiors() {
};


CustomQuestionBehabiors.DOMReady = function () {
    $(document).on('change', '#question-9 select', CustomQuestionBehabiors.Question9);
    $(document).on('change', '#question-19 select', CustomQuestionBehabiors.QuestionVisible);
}

CustomQuestionBehabiors.Question9 = function () {
    var questionVM = $.grep(vm.CurrentTest(), function (q) { return q.IdQuestion() === 9 })[0];
    var answerVM = questionVM.SelectedAnswer();

    if (answerVM != undefined) {
        var answer = answerVM.IdAnswer();

        if (answer === 34) { //cargo público
            $('#question-9 .ExtendedAnswerLabel').text('Indica el nombre del cargo público');
        }
        if (answer === 35) { //ONG
            $('#question-9 .ExtendedAnswerLabel').text('Indica el nombre de la ONG o Fundación');
        }
        if (answer === 36) { //los dos
            $('#question-9 .ExtendedAnswerLabel').text('Indica el nombre de la ONG o Fundación y del cargo público');
        }
    }
}

CustomQuestionBehabiors.Question4Visible = function (question) {
    if (question == 4) {
        var questionVM = $.grep(vm.CurrentTest(), function (q) { return q.IdQuestion() === 3 })[0];
        var questionText = $.grep(vm.CurrentTest(), function (q) { return q.IdQuestion() === 4 })[0];
        var answerVM = questionVM.SelectedAnswer();
        if (answerVM != undefined) {
            return true;
        } else {
            questionText.AnswerText(null);
            return false;
        }
    } else {
        return true;
    }
}


CustomQuestionBehabiors.Question3 = function () {
    //var questionVM = $.grep(vm.CurrentTest(), function (q) { return q.IdQuestion() === 3 })[0];
    //var answerVM = questionVM.SelectedAnswer();

    //if (answerVM != undefined) {
    //    $('#question-4').show();
    //} else {
    //    $('#question-4').hide();
    //}
}

CustomQuestionBehabiors.QuestionVisible = function () {
    hideQuestion(20, 19, [55]);
}

function hideQuestion(questionToHide, conditionalQuestion, goodAnswers) {
    var questionVM = $.grep(vm.CurrentTest(), function (q) { return q.IdQuestion() === conditionalQuestion })[0];
    var questionText = $.grep(vm.CurrentTest(), function (q) { return q.IdQuestion() === questionToHide })[0];
    var answerVM = questionVM.SelectedAnswer();
    if (answerVM != undefined && goodAnswers && answerVM.hasOwnProperty('IdAnswer') && goodAnswers.indexOf(answerVM.IdAnswer()) > -1) {
        questionText.QuestionVisible(true);
    } else {
        questionText.AnswerText(null);
        questionText.QuestionVisible(false);
    }
}
