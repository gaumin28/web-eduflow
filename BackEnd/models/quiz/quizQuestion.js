import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema(
  {
    quiz_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true
    },

    question: {
      type: String,
      required: true
    },

    order: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

const quizQuestionModel = mongoose.model(
  "QuizQuestion",
  quizQuestionSchema
);

export default quizQuestionModel;