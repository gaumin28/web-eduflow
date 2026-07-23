import { Router } from "express";
import {
  completeLecture,
  createCourse,
  deleteCourse,
  exportCourseExcel,
  getAllCourseOfProvider,
  getCourseById,
  getCourseLearningDetail,
  getFeaturedCourses,
  getPurchasedCourseById,
  UpdateCourse,
  updateLearningProgress,
} from "../controllers/course/course.js";
import { getCourses } from "../controllers/course/getCourses.js";
import authorizeRole  from "../middleware/authorizeRole.js";
import authMiddleware  from "../middleware/authMiddleware.js";
import { createCourseOverview, deleteCourseOverview, updateCourseOverview } from "../controllers/course/courseOverView.js";
import { createCourseLecture, deleteCourseLecture, updateCourseLecture } from "../controllers/course/courseLecture.js";
import { createCourseSection, deleteCourseSection, updateCourseSection } from "../controllers/course/courseSection.js";
import { createCourseRequest, updateCourseRequest } from "../controllers/course/courseRequest.js";


const routerCourse = Router();

// Danh sách khóa học với filter + phân trang
routerCourse.get("/api/courses", getCourses);
// Danh sách khóa học theo id provider
routerCourse.get(
  "/courses-of-provider",
  authMiddleware,
  authorizeRole("provider"),
  getAllCourseOfProvider
);
// Xuat file excel
routerCourse.get(
  "/my-courses/export-excel",
  authMiddleware,
  authorizeRole("provider"),
  exportCourseExcel
);
// Khóa học nổi bật
routerCourse.get("/courses/featured", getFeaturedCourses);
routerCourse.get("/courses-feature", getFeaturedCourses);
// Khóa học detail
routerCourse.get("/courses/:id", getCourseById);
// Chi tiết khóa học đã mua 
routerCourse.get(
  "/my-courses/:id",
  authMiddleware,
  authorizeRole("customer"),
  getPurchasedCourseById
);
// Học viên xem khóa học đã mua
routerCourse.get(
  "/learning/courses/:courseId",
  authMiddleware,
  authorizeRole("customer"),
  getCourseLearningDetail
);

// ************************************************************

// Thêm khóa học mới 
routerCourse.post(
  "/courses",
  authMiddleware, 
  authorizeRole('provider'), 
  createCourse
);

//Thêm tổng quan khóa học
routerCourse.post(
  "/courses/:courseId/overviews",
  authMiddleware,
  authorizeRole("provider"),
  createCourseOverview
);
// Thêm section khóa học
routerCourse.post(
  "/courses/:courseId/course-sections",
  authMiddleware, 
  authorizeRole('provider'), 
  createCourseSection
);
// Thêm lecture khóa học
routerCourse.post(
  "/course-lectures",
  createCourseLecture
);
//
routerCourse.post(
  "/sections/:sectionId/lectures",
  authMiddleware,
  authorizeRole("provider"),
  createCourseLecture
);

// Thêm yêu cầu khóa học
routerCourse.post(
  "/courses/:courseId/requests",
  authMiddleware,
  authorizeRole("provider"),
  createCourseRequest
);

// ************************************************************

// Cập nhật khóa học
routerCourse.put(
  "/courses/:id", 
  authMiddleware, 
  authorizeRole('provider'), 
  UpdateCourse  
);

// Cập nhật tổng quan khóa học
routerCourse.put(
  "/courses/:courseId/overviews/:overviewId",
  authMiddleware,
  authorizeRole("provider"),
  updateCourseOverview
);
// Cập nhật lecture detail
routerCourse.put(
  "/lectures/:lectureId",
  authMiddleware,
  authorizeRole("provider"),
  updateCourseLecture
);
// Cập nhật section
routerCourse.put("/courses/:courseId/course-sections/:sectionId",
  authMiddleware,
  authorizeRole("provider"),
  updateCourseSection
);

// Cập nhật yêu cầu khóa học
routerCourse.put(
  "/courses/requests/:courseRequestId",
  authMiddleware,
  authorizeRole("provider"),
  updateCourseRequest
);

// Cập nhật bài giảng hiện tại đang học của user trong khóa học
routerCourse.put(
  "/course-progress/update-learning-progress",
  authMiddleware,
  authorizeRole("customer"),
  updateLearningProgress
);
// Cập nhật hoàn thành bài giảng
routerCourse.put(
  "/course-progress/complete-lecture",
  authMiddleware,
  authorizeRole("customer"),
  completeLecture
);
// ************************************************************

// Xóa khóa học

routerCourse.delete(
  "/courses/:id", 
  authMiddleware, 
  authorizeRole('provider'), 
  deleteCourse
);

// Xóa tổng quan khóa học
routerCourse.delete(
  "/courses/:courseId/overviews/:overviewId",
  authMiddleware,
  authorizeRole("provider"),
  deleteCourseOverview
);


routerCourse.delete(
  "/courses/:courseId/sections/:sectionId",
  authMiddleware,
  authorizeRole("provider"),
  deleteCourseSection
);

routerCourse.delete(
  "/lectures/:lectureId",
  authMiddleware,
  authorizeRole("provider"),
  deleteCourseLecture
);
export default routerCourse;
