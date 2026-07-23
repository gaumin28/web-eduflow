import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  chapter_title: String,
  lecture_count: Number,
  duration: String,
  order: {
    type: Number,
    required: true,
  },
},
{
  timestamps: true,
});

    const courseSectionModel = mongoose.model("CourseSection", sectionSchema);

export default courseSectionModel;