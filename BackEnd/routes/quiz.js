import { Router } from "express";
import { createQuizController, deleteQuestion, deleteQuizController, getQuestionAndAnswers, getQuizForStudent, submitQuiz, updateQuestionQuiz, updateQuizController } from "../controllers/quiz/quiz.js";


import authMiddleware  from "../middleware/authMiddleware.js";
import authorizeRole  from "../middleware/authorizeRole.js";
import { createQuestionController, updateQuestionController } from "../controllers/quiz/quizQuestion.js";
import { updateQuestion } from "../services/quiz/quizService.js";


const routerQuizCourse = Router();

routerQuizCourse.post(
    "/quiz",
    authMiddleware,
    authorizeRole("provider"),
    createQuizController
);
routerQuizCourse.put(
    "/quiz/:id",
    authMiddleware,
    authorizeRole("provider"),
    updateQuizController
);


routerQuizCourse.delete(
    "/quiz/:id",
    authMiddleware,
    authorizeRole("provider"),
    deleteQuizController
);


// Question

routerQuizCourse.get(
    "/quiz/:quizId/questions",
    authMiddleware,
    authorizeRole("provider"),
    getQuestionAndAnswers
);

routerQuizCourse.get(
  "/learning/quiz/:quizId",
  authMiddleware,
  authorizeRole("customer"),
  getQuizForStudent
);

// Submit quiz
routerQuizCourse.post(
    "/quiz/:quizId/submit",
    authMiddleware,
    authorizeRole("customer"),
    submitQuiz
);


routerQuizCourse.post(
    "/quiz/question",
    authMiddleware,
    authorizeRole("provider"),
    createQuestionController
);
routerQuizCourse.put(
    "/quiz/question/:id",
    authMiddleware,
    authorizeRole("provider"),
    updateQuestionController
);

routerQuizCourse.put(
    "/questions/:questionId",
    authMiddleware,
    authorizeRole("provider"),
    updateQuestionQuiz
);


// Xóa quizz
routerQuizCourse.delete(
    "/quiz/:id",
    authMiddleware,
    authorizeRole("provider"),
    deleteQuizController
);
// Xóa câu hỏi và đáp án
routerQuizCourse.delete(
    "/questions/:questionId",
    authMiddleware,
    authorizeRole("provider"),
    deleteQuestion
);

export default routerQuizCourse;
