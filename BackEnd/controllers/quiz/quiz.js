import { createQuiz, updateQuiz, getQuestionByQuiz, deleteQuestionSV, deleteQuiz, updateQuestion } from "../../services/quiz/quizService.js";
import * as quizService from "../../services/quiz/quizService.js";

export const createQuizController = async (req, res) => {

    try {

        const quiz = await createQuiz(req.body);

        return res.status(201).json({
            message: "Tạo Quiz thành công",
            quiz
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }

};


export const updateQuizController = async (req, res) => {
  try {
    const quiz = await updateQuiz(req.params.id, req.body);

    return res.status(200).json({
      message: "Cập nhật thành công",
      quiz,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};


export const deleteQuizController = async (req, res) => {
    try {

        await deleteQuiz(req.params.id);

        return res.status(200).json({
            message: "Xóa Quiz thành công"
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }
};


export const getQuestionAndAnswers = async (req, res) => {
    try {
        const { quizId } = req.params;

        const data = await getQuestionByQuiz(quizId);

        return res.status(200).json({
            success: true,
            message: "Lấy danh sách câu hỏi thành công",
            data
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


export const deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;

        const result = await deleteQuestionSV(questionId);

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Xóa câu hỏi và đáp án thất bại",
        });
    }
};



export const updateQuestionQuiz = async (req, res) => {
  try {
    const { questionId } = req.params;

    const result = await updateQuestion(
      questionId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error(error); // thêm dòng này

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Lấy question và answer theo quizId cho học viên 

export const getQuizForStudent = async (req, res) => {
  try {
    const { quizId } = req.params;

    const data = await quizService.getQuizForStudent(quizId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Submit quiz cho học viên

export const submitQuiz = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { quizId } = req.params;
    const { answers } = req.body;

    const result = await quizService.submitQuizService(
      quizId,
      answers
    );

    if (result.passed) {
      await quizService.completeQuizService(
        userId,
        quizId
      );
    }
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};