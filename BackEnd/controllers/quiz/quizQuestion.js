import quizModel from "../../models/quiz/quiz.js";
import quizQuestionModel from "../../models/quiz/quizQuestion.js";
import { createQuestion, updateQuestion } from "../../services/quiz/quizService.js";

export const createQuestionController = async (req,res)=>{
    try{

        const question=await createQuestion(req.body);

        return res.status(201).json({
            message:"Thêm câu hỏi thành công",
            question
        });

    }catch(error){

        return res.status(400).json({
            message:error.message
        });

    }
}


export const updateQuestionController = async (req, res) => {
    try {

        const question = await updateQuestion(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            message: "Cập nhật câu hỏi thành công",
            question
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }
};

