# AUTHENTICATION & AUTHORIZATION SYSTEM

# 1. Tổng quan

Hệ thống Authentication & Authorization có nhiệm vụ:
- Xác thực người dùng (Authentication)
- Phân quyền người dùng (Authorization)
- Bảo vệ tài nguyên hệ thống
- Kiểm soát quyền truy cập theo role

Hệ thống hỗ trợ:
- Đăng ký tài khoản
- Đăng nhập
- Đăng xuất
- Quên mật khẩu
- Refresh Token
- Phân quyền theo role
- Bảo vệ API

---

# 2. Vai trò trong hệ thống

Hệ thống gồm 3 role chính:

- ADMIN
- CUSTOMER
- PROVIDER

---

# 3. Authentication — Xác thực người dùng

Authentication là quá trình xác minh danh tính người dùng.

---

# 3.1 Đăng ký tài khoản

## Chức năng
Cho phép người dùng tạo tài khoản mới trên hệ thống.

## Thông tin đăng ký
- Họ tên
- Email
- Password

## Business Rules
- Email là duy nhất
- Password phải được hash trước khi lưu database
- Người dùng mới mặc định có role CUSTOMER

## Flow

Guest
→ Register
→ Verify dữ liệu
→ Tạo User
→ Hash Password
→ Lưu Database
→ Đăng ký thành công

---

# 3.2 Đăng nhập

## Chức năng
Cho phép người dùng truy cập hệ thống bằng tài khoản đã đăng ký.

## Thông tin đăng nhập
- Email
- Password

## Business Rules
- Kiểm tra email tồn tại
- So sánh password đã hash
- Chỉ cho phép tài khoản active đăng nhập

## Flow

User
→ Login
→ Verify Email
→ Compare Password
→ Generate Access Token
→ Generate Refresh Token
→ Login Success

---

# 3.3 Đăng xuất

## Chức năng
Đăng xuất khỏi hệ thống.

## Business Rules
- Xóa Refresh Token
- Clear session/token phía client

---

# 3.4 Quên mật khẩu

## Chức năng
Cho phép người dùng đặt lại mật khẩu.

## Flow

User
→ Nhập Email
→ Generate Reset Token
→ Gửi Email Reset
→ User nhập mật khẩu mới
→ Update Password

## Business Rules
- Reset token có thời gian hết hạn
- Password mới phải được hash

---

# 3.5 Refresh Token

## Mục đích
Tạo Access Token mới khi token cũ hết hạn mà không cần đăng nhập lại.

## Flow

Access Token hết hạn
→ Client gửi Refresh Token
→ Verify Refresh Token
→ Generate Access Token mới

---

# 4. Authorization — Phân quyền hệ thống

Authorization là quá trình kiểm tra người dùng có quyền truy cập tài nguyên hay không.

---

# 4.1 Role-Based Access Control (RBAC)

Hệ thống sử dụng RBAC để phân quyền.

## Các role
- ADMIN
- CUSTOMER
- PROVIDER

---

# 4.2 CUSTOMER Permissions

## Có thể
- Xem khóa học
- Mua khóa học
- Học khóa học
- Review khóa học
- Cập nhật profile

## Không thể
- Quản trị hệ thống
- Quản lý khóa học của Provider khác

---

# 4.3 PROVIDER Permissions

## Có thể
- Tạo khóa học
- Chỉnh sửa khóa học của mình
- Upload video/tài liệu
- Xem doanh thu
- Quản lý học viên

## Không thể
- Quản trị hệ thống
- Quản lý Provider khác

---

# 4.4 ADMIN Permissions

## Có toàn quyền
- Quản lý users
- Quản lý providers
- Quản lý khóa học
- Kiểm duyệt nội dung
- Quản lý doanh thu
- Khóa/Mở khóa tài khoản

---

# 5. Access Token & Refresh Token

# 5.1 Access Token

## Mục đích
Xác thực API request.

## Đặc điểm
- Thời gian sống ngắn
- Chứa thông tin user
- Được gửi qua Authorization Header

## Ví dụ payload

{
  "userId": "...",
  "role": "CUSTOMER"
}

---

# 5.2 Refresh Token

## Mục đích
Tạo Access Token mới.

## Đặc điểm
- Thời gian sống dài hơn
- Lưu database hoặc cookie

---

# 6. Middleware Authentication

## Chức năng
Kiểm tra token trước khi cho phép truy cập API.

## Flow

Request
→ Verify JWT
→ Decode User
→ Attach req.user
→ Next()

---

# 7. Middleware Authorization

## Chức năng
Kiểm tra role người dùng.

## Ví dụ

ADMIN only:
- Manage users
- Manage system

PROVIDER only:
- Create course
- Update own course

CUSTOMER only:
- Enroll course

---

# 8. Bảo mật hệ thống

# Password Security
- Hash password bằng bcrypt
- Không lưu plain text password

---

# JWT Security
- Secret key riêng
- Access Token thời gian ngắn
- Refresh Token rotate

---

# API Security
- Protected Routes
- Validate Request Data
- Rate Limiting
- CORS

---

# 9. Database Structure

## User Schema

{
  name,
  email,
  password,
  role,
  avatar,
  isActive,
  refreshToken
}

---

# 10. Auth Flow Tổng quan

# Register Flow

Guest
→ Register
→ Create Account
→ CUSTOMER

---

# Login Flow

User
→ Login
→ Verify Credentials
→ Generate Tokens
→ Access System

---

# Become Provider Flow

CUSTOMER
→ Apply Provider
→ Admin Review
→ PROVIDER

---

# 11. API Modules

## Auth APIs
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- POST /auth/refresh-token
- POST /auth/forgot-password
- POST /auth/reset-password

---

# 12. Kết luận

Authentication & Authorization là hệ thống cốt lõi giúp:
- Xác thực người dùng
- Phân quyền truy cập
- Bảo vệ tài nguyên hệ thống
- Quản lý quyền theo role

Hệ thống được thiết kế theo mô hình JWT Authentication kết hợp Role-Based Access Control nhằm đảm bảo tính bảo mật và khả năng mở rộng trong tương lai.