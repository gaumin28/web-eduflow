import courseModel from "../../models/course/course.js";
import lectureModel from "../../models/course/courseLecture.js";
import courseSectionModel from "../../models/course/courseSection.js";
import providerModel from "../../models/provider.js";

export const createCourseLecture = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, duration, preview, vid_lectures_url } = req.body;

    if (!sectionId || !title || !duration) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const userId = req.user.userId;

    const provider = await providerModel.findOne({
      user_id: userId,
      status: "approved",
    });

    if (!provider) {
      return res.status(403).json({
        message: "Tài khoản chưa được duyệt làm nhà cung cấp!",
      });
    }

    const section = await courseSectionModel.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        message: "Section không tồn tại!",
      });
    }

    const course = await courseModel.findById(section.course_id);

    if (!course) {
      return res.status(404).json({
        message: "Không tìm thấy khóa học!",
      });
    }

    if (String(course.provider_id) !== String(provider._id)) {
      return res.status(403).json({
        message: "Bạn không có quyền thêm bài giảng vào section này!",
      });
    }

    // Lấy lecture cuối cùng trong section
    const lastLecture = await lectureModel
      .findOne({ section_id: sectionId })
      .sort({ order: -1 });

    const order = lastLecture ? lastLecture.order + 1 : 1;

    const lecture = await lectureModel.create({
      section_id: sectionId,
      title,
      duration,
      preview: preview ?? false,
      vid_lectures_url: vid_lectures_url ?? null,
      order,
    });

    await courseSectionModel.findByIdAndUpdate(sectionId, {
      $inc: {
        lecture_count: 1,
      },
    });

    return res.status(201).json({
      message: "Tạo lecture thành công",
      lecture,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const updateCourseLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { title, duration, preview, vid_lectures_url } = req.body;

    if (!lectureId || !title || !duration) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const userId = req.user.userId;

    // Check provider
    const provider = await providerModel.findOne({
      user_id: userId,
      status: "approved",
    });
    if (!provider) {
      return res.status(403).json({
        message: "Tài khoản chưa được duyệt làm nhà cung cấp!",
      });
    }

    // Check lecture
    const lecture = await lectureModel.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Không tìm thấy bài giảng!",
      });
    }

    // Check section
    const section = await courseSectionModel.findById(lecture.section_id);
    if (!section) {
      return res.status(404).json({
        message: "Section không tồn tại!",
      });
    }

    // Check course
    const course = await courseModel.findById(section.course_id);
    if (!course) {
      return res.status(404).json({
        message: "Không tìm thấy khóa học!",
      });
    }

    if (String(course.provider_id) !== String(provider._id)) {
      return res.status(403).json({
        message: "Bạn không có quyền cập nhật bài giảng này!",
      });
    }

    // Update lecture
    lecture.title = title;
    lecture.duration = duration;
    lecture.preview = preview ?? false;
    lecture.vid_lectures_url = vid_lectures_url ?? null;

    await lecture.save();

    return res.status(200).json({
      message: "Cập nhật bài giảng thành công",
      lecture,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// controllers/courseLecture.controller.js
export const deleteCourseLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const userId = req.user.userId;

    // Check lecture tồn tại
    const lecture = await lectureModel.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Không tìm thấy bài giảng!",
      });
    }

    // Tìm section
    const section = await courseSectionModel.findById(lecture.section_id);
    if (!section) {
      return res.status(404).json({
        message: "Section không tồn tại!",
      });
    }

    // Tìm course
    const course = await courseModel.findById(section.course_id);
    if (!course) {
      return res.status(404).json({
        message: "Không tìm thấy khóa học!",
      });
    }

    // Check provider
    const provider = await providerModel.findOne({
      user_id: userId,
      status: "approved",
    });

    if (!provider) {
      return res.status(403).json({
        message: "Tài khoản chưa được duyệt làm nhà cung cấp!",
      });
    }

    // Check quyền
    if (String(course.provider_id) !== String(provider._id)) {
      return res.status(403).json({
        message: "Bạn không có quyền xóa bài giảng này!",
      });
    }

    // Xóa lecture
    await lectureModel.findByIdAndDelete(lectureId);

    // Giảm lecture_count
    await courseSectionModel.findByIdAndUpdate(section._id, {
      $inc: { lecture_count: -1 },
    });

    return res.status(200).json({
      message: "Xóa bài giảng thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};