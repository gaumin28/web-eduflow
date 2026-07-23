
import mongoose from "mongoose";
import courseModel from "../../models/course/course.js";
import courseOverviewModel from "../../models/course/courseOverview.js";
import providerModel from "../../models/provider.js";


export const createCourseOverview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { overview_name } = req.body;

    if (!courseId || !overview_name) {
      return res.status(400).json({
        message: "Missing courseId or overview_name",
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

    // Check course tồn tại
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Không tìm thấy khóa học!",
      });
    }

    // Check quyền sở hữu course
    if (String(course.provider_id) !== String(provider._id)) {
      return res.status(403).json({
        message: "Bạn không có quyền thêm overview cho khóa học này!",
      });
    }
    // Tạo overview
    const overview = await courseOverviewModel.create({
      course_id: courseId,
      overview_name,
    });

    return res.status(201).json({
      message: "Thêm overview thành công",
      overview,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCourseOverview = async (req, res) => {
  try {
    const { courseId, overviewId } = req.params;
    const { overview_name } = req.body;

    if (!courseId || !overviewId || !overview_name) {
      return res.status(400).json({
        message: "Missing courseId, overviewId or overview_name",
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

    // Check quyền sở hữu
    if (String(course.provider_id) !== String(provider._id)) {
      return res.status(403).json({
        message: "Bạn không có quyền sửa overview khóa học này!",
      });
    }

    // Check overview
    const overview = await courseOverviewModel.findOne({
      _id: overviewId,
      course_id: courseId,
    });

    if (!overview) {
      return res.status(404).json({
        message: "Không tìm thấy overview!",
      });
    }

    // Update
    overview.overview_name = overview_name;
    await overview.save();

    return res.status(200).json({
      message: "Cập nhật overview thành công",
      overview,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Xóa overview
export const deleteCourseOverview = async (req, res) => {
  try {
    const { courseId, overviewId } = req.params;

    if (!courseId || !overviewId) {
      return res.status(400).json({
        message: "Missing courseId or overviewId",
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

    // Check quyền sở hữu course
    if (String(course.provider_id) !== String(provider._id)) {
      return res.status(403).json({
        message: "Bạn không có quyền xóa overview khóa học này!",
      });
    }

    // Check overview
    const overview = await courseOverviewModel.findOne({
      _id: overviewId,
      course_id: courseId,
    });

    if (!overview) {
      return res.status(404).json({
        message: "Không tìm thấy overview!",
      });
    }

    // Xóa overview
    await courseOverviewModel.findByIdAndDelete(overviewId);

    return res.status(200).json({
      message: "Xóa overview thành công",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
  