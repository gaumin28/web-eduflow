# BUSINESS CORE — ONLINE COURSE MARKETPLACE SYSTEM

# 1. Giới thiệu hệ thống

## 1.1 Tổng quan

Hệ thống là một nền tảng Online Course Marketplace kết hợp giữa:
- E-Learning (học trực tuyến)
- E-Commerce (mua bán khóa học online)

Nền tảng cho phép nhiều Nhà cung cấp khóa học (Providers) đăng tải và kinh doanh khóa học trực tuyến trên cùng một hệ thống.

Người học (Customers) có thể:
- Tìm kiếm khóa học
- Mua khóa học
- Học trực tuyến
- Theo dõi tiến độ học tập
- Đánh giá khóa học

Ngoài ra, tất cả người dùng sau khi đăng ký tài khoản đều có thể đăng ký trở thành Nhà cung cấp khóa học trên hệ thống.

---

# 2. Mục tiêu hệ thống

Hệ thống được xây dựng nhằm:
- Hỗ trợ học tập trực tuyến
- Tạo môi trường kinh doanh khóa học online
- Kết nối giảng viên và học viên
- Quản lý khóa học tập trung
- Hỗ trợ mở rộng hệ thống đào tạo trực tuyến

---

# 3. Công nghệ sử dụng

## Frontend
- ReactJS
- TailwindCSS

## Backend
- ExpressJS
- NodeJS

## Database
- MongoDB
- Mongoose

## Media Storage
- Cloudinary

---

# 4. Vai trò hệ thống

# 4.1 Admin — Quản trị hệ thống

Admin là bên quản trị và vận hành toàn bộ nền tảng.

## Chức năng chính
- Quản lý người dùng
- Quản lý Providers
- Kiểm duyệt khóa học
- Quản lý danh mục khóa học
- Quản lý báo cáo vi phạm
- Quản lý nội dung hệ thống
- Quản lý doanh thu hệ thống
- Khóa/Mở khóa tài khoản

---

# 4.2 Customer — Khách hàng/Học viên

Customer là người sử dụng hệ thống để mua và học khóa học trực tuyến.

## Chức năng chính
- Đăng ký/Đăng nhập
- Quản lý thông tin cá nhân
- Tìm kiếm khóa học
- Xem chi tiết khóa học
- Thêm khóa học vào wishlist
- Thêm khóa học vào cart
- Thanh toán khóa học
- Học trực tuyến
- Theo dõi tiến độ học tập
- Đánh giá khóa học
- Đăng ký trở thành Provider

---

# 4.3 Provider — Nhà cung cấp khóa học

Provider là người tạo và kinh doanh khóa học trên hệ thống.

## Chức năng chính
- Tạo khóa học
- Chỉnh sửa khóa học
- Upload thumbnail/video/tài liệu
- Quản lý nội dung khóa học
- Quản lý học viên
- Theo dõi doanh thu
- Theo dõi thống kê khóa học

---

# 5. Quy trình nghiệp vụ chính

# 5.1 Quy trình đăng ký tài khoản

## Flow

Guest
→ Register
→ Customer

Sau khi đăng ký:
- Người dùng mặc định có role Customer
- Có thể tham gia học tập trên hệ thống
- Có thể đăng ký trở thành Provider

---

# 5.2 Quy trình trở thành Provider

## Bước 1
Customer gửi yêu cầu đăng ký trở thành Provider.

## Thông tin đăng ký
- Tên hiển thị
- Mô tả cá nhân
- Avatar
- Thông tin liên hệ

## Bước 2
Admin kiểm duyệt yêu cầu.

## Trạng thái Provider
- Pending
- Approved
- Rejected
- Suspended

## Bước 3
Nếu được duyệt:
- Người dùng được cấp quyền Provider
- Có quyền tạo và quản lý khóa học

---

# 5.3 Quy trình tạo khóa học

## Bước 1 — Thông tin cơ bản
- Tên khóa học
- Mô tả khóa học
- Thumbnail
- Danh mục khóa học
- Giá khóa học
- Trình độ
- Ngôn ngữ

---

## Bước 2 — Xây dựng nội dung khóa học

## Cấu trúc khóa học

Course
- Sections
  - Lessons
    - Video
    - Document

---

## Bước 3 — Upload media

Provider upload:
- Thumbnail
- Video bài giảng
- Tài liệu khóa học

Dữ liệu media được lưu trên Cloudinary.

---

## Bước 4 — Submit review

Khóa học được gửi đến Admin để kiểm duyệt trước khi publish.

---

# 5.4 Quy trình mua khóa học

## Flow

Customer:
- Chọn khóa học
- Thêm vào cart
- Thanh toán

Sau khi thanh toán thành công:
- Tạo Order
- Tạo Enrollment
- Cấp quyền học khóa học

---

# 5.5 Quy trình học trực tuyến

Sau khi mua khóa học:
- Người học có thể xem video bài giảng
- Xem tài liệu
- Theo dõi tiến độ học tập

Hệ thống lưu:
- Danh sách bài học đã hoàn thành
- % hoàn thành khóa học
- Thời gian học

---

# 5.6 Quy trình đánh giá khóa học

Điều kiện:
- Người dùng đã mua khóa học

Người dùng có thể:
- Đánh giá sao
- Bình luận nhận xét

---

# 6. Quản lý khóa học

# 6.1 Trạng thái khóa học

- Draft
- Pending Review
- Published
- Rejected
- Hidden
- Archived

---

# 6.2 Cấu trúc khóa học

Course
- Sections
  - Lessons

Lesson gồm:
- Video lesson
- Document lesson

---

# 7. Hệ thống thanh toán

# 7.1 Chức năng
- Thanh toán khóa học
- Quản lý đơn hàng
- Quản lý doanh thu

---

# 7.2 Trạng thái thanh toán
- Pending
- Paid
- Failed
- Refunded

---

# 7.3 Chia doanh thu

Ví dụ:
- Provider nhận: 80%
- Hệ thống nhận: 20%

---

# 8. Hệ thống học tập

# 8.1 Enrollment

Sau khi thanh toán thành công:
- Người dùng được ghi danh vào khóa học

---

# 8.2 Theo dõi tiến độ học

Hệ thống theo dõi:
- % hoàn thành khóa học
- Lesson đã học

---

# 9. Quản lý người dùng

Hệ thống hỗ trợ:
- Quản lý profile
- Avatar
- Đổi mật khẩu
- Quản lý role
- Khóa tài khoản

---

# 10. Notification System

Hệ thống gửi thông báo khi:
- Thanh toán thành công
- Khóa học được duyệt
- Provider được duyệt
- Có cập nhật khóa học

---

# 11. Hệ thống tìm kiếm

Cho phép:
- Search khóa học
- Filter theo:
  - Category
  - Price
  - Level
  - Rating

---

# 12. Wishlist & Cart

# Wishlist
Người dùng có thể lưu khóa học yêu thích.

# Cart
Người dùng có thể mua nhiều khóa học cùng lúc.

---

# 13. Phân quyền hệ thống

# CUSTOMER

Có thể:
- Mua khóa học
- Học khóa học
- Đánh giá khóa học

Không thể:
- Tạo khóa học
- Quản trị hệ thống

---

# PROVIDER

Có thể:
- Tạo khóa học
- Quản lý khóa học
- Theo dõi doanh thu

Không thể:
- Quản trị hệ thống

---

# ADMIN

Có toàn quyền:
- Quản trị hệ thống
- Kiểm duyệt khóa học
- Quản lý người dùng
- Quản lý doanh thu

---

# 14. Kiến trúc module hệ thống

## Core Modules
- Authentication
- User Management
- Provider Management
- Course Management
- Enrollment Management
- Payment Management
- Review System
- Notification System
- Admin CMS

---

# 15. Database Collections

## Collections chính
- users
- providers
- courses
- sections
- lessons
- enrollments
- orders
- reviews
- categories

---

# 16. Kết luận

Hệ thống Online Course Marketplace là nền tảng học trực tuyến đa giảng viên kết hợp mô hình thương mại điện tử khóa học số.

Hệ thống hỗ trợ:
- Quản lý khóa học
- Quản lý học tập
- Quản lý thanh toán
- Quản lý doanh thu
- Quản lý người dùng

Kiến trúc được thiết kế theo hướng module hóa nhằm dễ mở rộng và bảo trì trong tương lai.