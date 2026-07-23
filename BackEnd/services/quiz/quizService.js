import quizModel from "../../models/quiz/quiz.js";
import courseSectionModel from "../../models/course/courseSection.js";
import courseProgressModel from "../../models/course/courseProgress.js";
import lectureModel from "../../models/course/courseLecture.js";

export const createQuiz = async (data) => {

    const { section_id, title, description } = data;

    // kiểm tra section tồn tại
    const section = await courseSectionModel.findById(section_id);

    if (!section) {
        throw new Error("Section không tồn tại");
    }

    // kiểm tra section đã có quiz chưa
    const existedQuiz = await quizModel.findOne({
        section_id
    });

    if (existedQuiz) {
        throw new Error("Section đã có Quiz");
    }

    const quiz = await quizModel.create({
        section_id,
        title,
        description
    });

    return quiz;
};


export const updateQuiz = async (quizId, data) => {

    const quiz = await quizModel.findByIdAndUpdate(
        quizId,
        data,
        {
            new: true,
            runValidators: true
        }
    );

    if (!quiz) {
        throw new Error("Quiz không tồn tại");
    }

    return quiz;

};


export const deleteQuiz = async (quizId) => {

    const quiz = await quizModel.findById(quizId);

    if (!quiz) {
        throw new Error("Quiz không tồn tại");
    }

    await quiz.deleteOne();

    return;
};


// Question


import quizQuestionModel from "../../models/quiz/quizQuestion.js";
import quizAnswerModel from "../../models/quiz/quizAnswer.js";

export const getQuestionByQuiz = async (quiz_id) => {
    const quiz = await quizModel.findById(quiz_id).lean();

    if (!quiz) {
        throw new Error("Quiz không tồn tại");
    }

    const questions = await quizQuestionModel
        .find({ quiz_id })
        .sort({ order: 1 })
        .lean();

    const answers = await quizAnswerModel
        .find({
            question_id: {
                $in: questions.map(question => question._id)
            }
        })
        .lean();

    const questionsWithAnswers = questions.map(question => ({
        ...question,
        answers: answers.filter(
            answer =>
                answer.question_id.toString() === question._id.toString()
        )
    }));

    return {
        ...quiz,
        questions: questionsWithAnswers
    };
};

export const getQuizForStudent = async (quizId) => {
  const quiz = await quizModel.findById(quizId).lean();

  if (!quiz) {
    throw new Error("Quiz không tồn tại");
  }

  // Lấy danh sách câu hỏi và đáp án của quiz

  const questions = await quizQuestionModel
    .find({ quiz_id: quizId })
    .sort({ order: 1 })
    .lean();

  const answers = await quizAnswerModel.find({
    question_id: {
      $in: questions.map((q) => q._id),
    },
  }).lean();

  const questionsWithAnswers = questions.map((question) => ({
    ...question,

    answers: answers
      .filter(
        (answer) =>
          answer.question_id.toString() === question._id.toString()
      )
      .map((answer) => ({
        _id: answer._id,
        answer_label: answer.answer_label,
        answer_text: answer.answer_text,
      })),
  }));

  return {
    _id: quiz._id,
    title: quiz.title,
    description: quiz.description,
    total_questions: questions.length,
    questions: questionsWithAnswers,
  };
};

export const createQuestion = async (data) => {

    const { quiz_id, question, answers } = data;

    const quiz = await quizModel.findById(quiz_id);

    if (!quiz) {
        throw new Error("Quiz không tồn tại");
    }

    if (!answers || answers.length !== 4) {
        throw new Error("Phải có đúng 4 đáp án");
    }

    const correctAnswer = answers.filter(item => item.is_correct);

    if (correctAnswer.length !== 1) {
        throw new Error("Chỉ được có 1 đáp án đúng");
    }

    const lastQuestion = await quizQuestionModel
    .findOne({ quiz_id })
    .sort({ order: -1 });

    const order = lastQuestion ? lastQuestion.order + 1 : 1;

    const newQuestion = await quizQuestionModel.create({
        quiz_id,
        question,
        order,
    });
    const labels = ["A", "B", "C", "D"];
    await quizAnswerModel.insertMany(

        answers.map((item, index) => ({
            question_id: newQuestion._id,
            answer_label: labels[index],
            answer_text: item.answer_text,
            is_correct: item.is_correct
        }))

    );

    return newQuestion;
};



export const updateQuestion = async (questionId, data) => {
    const { question, answers } = data;

    const questionExist = await quizQuestionModel.findById(questionId);

    if (!questionExist) {
        throw new Error("Câu hỏi không tồn tại");
    }

    if (!answers || answers.length !== 4) {
        throw new Error("Phải có đúng 4 đáp án");
    }

    const correctAnswer = answers.filter(item => item.is_correct);

    if (correctAnswer.length !== 1) {
        throw new Error("Chỉ được có 1 đáp án đúng");
    }

    // Cập nhật câu hỏi
    questionExist.question = question;
    await questionExist.save();

    // Lấy đáp án cũ
    const oldAnswers = await quizAnswerModel
        .find({ question_id: questionId })
        .sort({ answer_label: 1 });

    // Cập nhật từng đáp án
    await Promise.all(
        oldAnswers.map((answer, index) =>
            quizAnswerModel.findByIdAndUpdate(answer._id, {
                answer_text: answers[index].answer_text,
                is_correct: answers[index].is_correct,
            })
        )
    );

    return {
        message: "Cập nhật câu hỏi thành công",
    };
};
// Delete question

export const deleteQuestionSV = async (questionId) => {
    const question = await quizQuestionModel.findById(questionId);

    if (!question) {
        throw new Error("Câu hỏi không tồn tại");
    }

    const quizId = question.quiz_id;

    // Xóa tất cả đáp án của câu hỏi
    await quizAnswerModel.deleteMany({
        question_id: questionId,
    });

    // Xóa câu hỏi
    await quizQuestionModel.findByIdAndDelete(questionId);

    // Lấy lại các câu hỏi còn lại của quiz
    const questions = await quizQuestionModel
        .find({ quiz_id: quizId })
        .sort({ order: 1 });

    // Cập nhật lại order
    await Promise.all(
        questions.map((item, index) =>
            quizQuestionModel.findByIdAndUpdate(item._id, {
                order: index + 1,
            })
        )
    );

    return {
        message: "Xóa câu hỏi thành công",
    };
};


//  Submit quiz
export const submitQuizService = async (quizId, userAnswers) => {
  const quiz = await quizModel.findById(quizId).lean();

  const questions = await quizQuestionModel.find({
    quiz_id: quizId,
  }).lean();

  const answers = await quizAnswerModel.find({
    question_id: {
      $in: questions.map((q) => q._id),
    },
  }).lean();

  let correctCount = 0;
  const resultAnswers = {};

  for (const question of questions) {
    const correctAnswer = answers.find(
      (a) =>
        a.question_id.toString() === question._id.toString() &&
        a.is_correct
    );

    const userAnswerId = userAnswers[question._id.toString()];

    const isCorrect =
      correctAnswer?._id.toString() === userAnswerId;

    if (isCorrect) correctCount++;

    resultAnswers[question._id] = {
      userAnswerId,
      correctAnswerId: correctAnswer?._id.toString(),
      isCorrect,
    };
  }

  return {
    totalQuestions: questions.length,
    correctCount,
    wrongCount: questions.length - correctCount,
    passed: correctCount === questions.length,
    answers: resultAnswers,
    };
};


export const completeQuizService = async (
  userId,
  quizId
) => {
    const quiz = await quizModel.findById(quizId);

    const section = await courseSectionModel.findById(
        quiz.section_id
    );
    const nextSection = await courseSectionModel.findOne({
        course_id: section.course_id,
        order: section.order + 1,
    });
   
    let firstLecture = null;

    if (nextSection) {

    firstLecture = await lectureModel
        .findOne({
        section_id: nextSection._id,
        })
        .sort({ order: 1 });
    }

    const updateData = {
        $addToSet: {
            completed_quiz_ids: quizId,
        },
    };

    if (nextSection) {
        updateData.$addToSet.unlocked_section_ids =
            nextSection._id;
    }

    if (firstLecture) {
        updateData.$addToSet.unlocked_lecture_ids = firstLecture._id;
    }

        const progress = await courseProgressModel.findOneAndUpdate(
        {
            user_id: userId,
            course_id: section.course_id,
        },
        updateData,
        {
            returnDocument: "after",
        }
    );

    if (!progress) {
        throw new Error("Không tìm thấy tiến trình học");
    }

  return progress;
};