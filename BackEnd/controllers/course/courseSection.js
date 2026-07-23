import courseModel from "../../models/course/course.js";
import lectureModel from "../../models/course/courseLecture.js";
import courseSectionModel from "../../models/course/courseSection.js";
import providerModel from "../../models/provider.js";

export const createCourseSection = async (req, res) => {
  try {
    const { courseId } = req.params;         
    const { chapter_title, duration } = req.body;     

    if (!courseId || !chapter_title) {
      return res.status(400).send({
        message: "Missing courseId or chapter_title",
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

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Không tìm thấy khóa học!" });
    }

    if (String(course.provider_id) !== String(provider._id)) {
      return res.status(403).json({ message: "Bạn không có quyền thêm section cho khóa học này!" });
    }
    const lastSection = await courseSectionModel
      .findOne({ course_id: courseId })
      .sort({ order: -1 });

    const order = lastSection ? lastSection.order + 1 : 1;
    // Tạo section với course_id lấy từ URL
    const section = await courseSectionModel.create({
      course_id: courseId,
      chapter_title,
      duration,
      order
    });

    return res.status(201).send({
      message: "Tạo section thành công",
      section,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

export const updateCourseSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { chapter_title, duration } = req.body;

    if (!courseId || !sectionId || !chapter_title) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // Lấy userId từ token
    const userId = req.user.userId;

    // Tìm provider
    const provider = await providerModel.findOne({
      user_id: userId,
      status: "approved",
    });

    if (!provider) {
      return res.status(403).json({
        message: "Tài khoản chưa được duyệt làm nhà cung cấp!",
      });
    }

    // Kiểm tra course
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Không tìm thấy khóa học!",
      });
    }

    if (String(course.provider_id) !== String(provider._id)) {
      return res.status(403).json({
        message: "Bạn không có quyền sửa section của khóa học này!",
      });
    }

    // Kiểm tra section
    const section = await courseSectionModel.findOne({
      _id: sectionId,
      course_id: courseId,
    });

    if (!section) {
      return res.status(404).json({
        message: "Không tìm thấy section!",
      });
    }

    // Update
    section.chapter_title = chapter_title;
    section.duration = duration;

    await section.save();

    return res.status(200).json({
      message: "Cập nhật section thành công",
      section,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteCourseSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;

    if (!courseId || !sectionId) {
      return res.status(400).json({
        message: "Missing courseId or sectionId",
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

    // Check course
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Không tìm thấy khóa học!",
      });
    }

    if (String(course.provider_id) !== String(provider._id)) {
      return res.status(403).json({
        message: "Bạn không có quyền xóa section của khóa học này!",
      });
    }

    // Check section
    const section = await courseSectionModel.findOne({
      _id: sectionId,
      course_id: courseId,
    });

    if (!section) {
      return res.status(404).json({
        message: "Không tìm thấy section!",
      });
    }

    // XÓA TOÀN BỘ LECTURE TRONG SECTION
    await lectureModel.deleteMany({
      section_id: sectionId,
    });

    // XÓA SECTION
    await courseSectionModel.findByIdAndDelete(sectionId);

    return res.status(200).json({
      message: "Xóa section và toàn bộ bài giảng thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};