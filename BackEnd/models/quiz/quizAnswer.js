import mongoose from "mongoose";

const quizAnswerSchema = new mongoose.Schema(
  {
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizQuestion",
      required: true
    },

    answer_label: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true
    },

    answer_text: {
      type: String,
      required: true
    },

    is_correct: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const quizAnswerModel = mongoose.model(
  "QuizAnswer",
  quizAnswerSchema
);

export default quizAnswerModel;