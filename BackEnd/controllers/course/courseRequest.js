

import courseModel from "../../models/course/course.js";
import courseRequestModel from "../../models/course/courseRequest.js";
import providerModel from "../../models/provider.js";

export const createCourseRequest = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { request_name } = req.body;

    if (!courseId || !request_name) {
      return res.status(400).json({
        message: "Missing courseId or request_name",
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
        message: "Bạn không có quyền thêm yêu cầu cho khóa học này!",
      });
    }

    // tránh trùng request trong cùng course
    const existedRequest = await courseRequestModel.findOne({
      course_id: courseId,
      request_name,
    });

    if (existedRequest) {
      return res.status(400).json({
        message: "Yêu cầu này đã tồn tại!",
      });
    }

    // Tạo request
    const request = await courseRequestModel.create({
      course_id: courseId,
      request_name,
    });

    return res.status(201).json({
      message: "Thêm requirement thành công",
      request,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCourseRequest = async (req, res) => {
  try {
    const { courseRequestId } = req.params;
    const { request_name } = req.body;

    if (!courseRequestId || !request_name) {
      return res.status(400).json({
        message: "Missing courseRequestId or request_name",
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

    // Check request tồn tại
    const courseRequest = await courseRequestModel.findById(courseRequestId);
    if (!courseRequest) {
      return res.status(404).json({
        message: "Không tìm thấy yêu cầu!",
      });
    }

    // Check course tồn tại
    const course = await courseModel.findById(courseRequest.course_id);
    if (!course) {
      return res.status(404).json({
        message: "Không tìm thấy khóa học!",
      });
    }

    // Check quyền sở hữu course
    if (String(course.provider_id) !== String(provider._id)) {
      return res.status(403).json({
        message: "Bạn không có quyền sửa yêu cầu của khóa học này!",
      });
    }

    // check trùng request_name trong course
    const existedRequest = await courseRequestModel.findOne({
      _id: { $ne: courseRequestId },
      course_id: course._id,
      request_name,
    });

    if (existedRequest) {
      return res.status(400).json({
        message: "Yêu cầu này đã tồn tại!",
      });
    }

    // Update
    courseRequest.request_name = request_name;
    await courseRequest.save();

    return res.status(200).json({
      message: "Cập nhật requirement thành công",
      request: courseRequest,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};