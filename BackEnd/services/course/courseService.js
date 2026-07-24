import courseModel from "../../models/course/course.js";
import lectureModel from "../../models/course/courseLecture.js";
import courseOverviewModel from "../../models/course/courseOverview.js";
import courseRequestModel from "../../models/course/courseRequest.js";
import courseSectionModel from "../../models/course/courseSection.js";
import quizModel from "../../models/quiz/quiz.js";
import quizQuestionModel from "../../models/quiz/quizQuestion.js";
import quizAnswerModel from "../../models/quiz/quizAnswer.js";
import orderModel from "../../models/order.js";
import courseProgressModel from "../../models/course/courseProgress.js";

export const getCourseDetail = async (courseId) => {
  const course = await courseModel
    .findById(courseId)
    .populate("category_id", "cate_name")
    .populate("provider_id", "provider_name avatar images career description")
    .lean();

  if (!course) return null;

  const [requests, overviews, sections] = await Promise.all([
    courseRequestModel.find({ course_id: courseId }).lean(),
    courseOverviewModel.find({ course_id: courseId }).lean(),
    courseSectionModel.find({ course_id: courseId }).lean(),
  ]);

  const lectures = await lectureModel
    .find({
      section_id: { $in: sections.map((s) => s._id) },
    })
    .lean();

  const quizzes = await quizModel
    .find({
      section_id: {
        $in: sections.map((section) => section._id),
      },
    })
    .lean();

  const sectionsWithLectures = sections.map((section) => ({
    ...section,

    lectures: lectures.filter(
      (lecture) => lecture.section_id.toString() === section._id.toString(),
    ),

    quizzes: quizzes.filter(
      (quiz) => quiz.section_id.toString() === section._id.toString(),
    ),
  }));

  return {
    course: {
      ...course,
      category_id: course.category_id?._id,
      category_name: course.category_id?.cate_name,
      provider_id: course.provider_id?._id,
      provider_name: course.provider_id?.provider_name,
      provider_avatar: course.provider_id?.avatar ?? "",
      provider_images: course.provider_id?.images ?? [],
      provider_career: course.provider_id?.career ?? "",
      provider_description: course.provider_id?.description ?? "",
    },
    requests,
    overviews,
    sections: sectionsWithLectures,
  };
};

export const getCourseLearningDetail = async (userId, courseId) => {
  const order = await orderModel.findOne({
    user: userId,
    payment_status: "paid",
    "items.course": courseId,
  });

  if (!order) {
    throw new Error("Bạn chưa mua khóa học này");
  }
  const course = await courseModel
    .findById(courseId)
    .populate("category_id", "cate_name")
    .populate("provider_id", "provider_name avatar images career description")
    .lean();

  if (!course) {
    throw new Error("Khóa học không tồn tại");
  }

  const [overviews, requests, sections, progress] = await Promise.all([
    courseOverviewModel.find({ course_id: courseId }).lean(),
    courseRequestModel.find({ course_id: courseId }).lean(),
    courseSectionModel.find({ course_id: courseId }).lean(),
    courseProgressModel
      .findOne({
        user_id: userId,
        course_id: courseId,
      })
      .lean(),
  ]);

  const lectures = await lectureModel
    .find({
      section_id: {
        $in: sections.map((section) => section._id),
      },
    })
    .lean();

  const totalSections = sections.length;
  const totalLectures = lectures.length;

  const quizzes = await quizModel
    .find({
      section_id: {
        $in: sections.map((section) => section._id),
      },
    })
    .lean();

  const sectionsWithData = sections.map((section) => {
    const sectionLectures = lectures.filter(
      (lecture) => lecture.section_id.toString() === section._id.toString(),
    );

    return {
      ...section,

      is_unlocked:
        progress?.unlocked_section_ids.some(
          (id) => id.toString() === section._id.toString(),
        ) || false,

      lectures: sectionLectures.map((lecture) => ({
        ...lecture,

        is_completed:
          progress?.completed_lecture_ids.some(
            (id) => id.toString() === lecture._id.toString(),
          ) || false,

        is_current:
          progress?.current_lecture_id?.toString() === lecture._id.toString(),
      })),

      quizzes: quizzes
        .filter((quiz) => quiz.section_id.toString() === section._id.toString())
        .map((quiz) => ({
          ...quiz,

          is_completed:
            progress?.completed_quiz_ids.some(
              (id) => id.toString() === quiz._id.toString(),
            ) || false,
        })),
    };
  });

  return {
    course: {
      ...course,
      total_sections: totalSections,
      total_lectures: totalLectures,
      category_id: course.category_id?._id,
      category_name: course.category_id?.cate_name,
      provider_id: course.provider_id?._id,
      provider_name: course.provider_id?.provider_name,
      provider_avatar: course.provider_id?.avatar ?? "",
      provider_images: course.provider_id?.images ?? [],
      provider_career: course.provider_id?.career ?? "",
      provider_description: course.provider_id?.description ?? "",
    },

    progress: {
      unlocked_section_ids: progress?.unlocked_section_ids || [],
      completed_lecture_ids: progress?.completed_lecture_ids || [],
      completed_quiz_ids: progress?.completed_quiz_ids || [],
      current_lecture_id: progress?.current_lecture_id || null,
    },

    overviews,
    requests,
    sections: sectionsWithData,
  };
};

// tiến trình học của user trong khóa học

export const createProgressAfterCheckout = async (userId, items) => {
  for (const item of items) {
    const exist = await courseProgressModel.findOne({
      user_id: userId,
      course_id: item.course,
    });

    if (exist) continue;

    // Lấy chương đầu tiên
    const firstSection = await courseSectionModel
      .findOne({ course_id: item.course })
      .sort({ createdAt: 1 });

    let firstLecture = null;

    if (firstSection) {
      firstLecture = await lectureModel
        .findOne({ section_id: firstSection._id })
        .sort({ order: 1 });
    }

    await courseProgressModel.create({
      user_id: userId,
      course_id: item.course,

      unlocked_section_ids: firstSection ? [firstSection._id] : [],

      unlocked_lecture_ids: firstLecture ? [firstLecture._id] : [],

      completed_lecture_ids: [],

      completed_quiz_ids: [],

      current_lecture_id: null,
    });
  }
};

// Cập nhật bài giảng hiện tại đang học của user trong khóa học

export const updateLearningProgressService = async (
  userId,
  courseId,
  lectureId,
) => {
  const progress = await courseProgressModel.findOneAndUpdate(
    {
      user_id: userId,
      course_id: courseId,
    },
    {
      $set: {
        current_lecture_id: lectureId,
      },
    },
    {
      returnDocument: "after",
    },
  );

  if (!progress) {
    throw new Error("Không tìm thấy tiến trình học");
  }

  return progress;
};

export const completeLectureService = async (userId, courseId, lectureId) => {
  const lecture = await lectureModel.findById(lectureId);

  if (!lecture) {
    throw new Error("Lecture không tồn tại");
  }

  const progress = await courseProgressModel.findOneAndUpdate(
    {
      user_id: userId,
      course_id: courseId,
    },
    {
      $addToSet: {
        completed_lecture_ids: lectureId,
      },
    },
    {
      returnDocument: "after",
    },
  );

  return progress;
};
