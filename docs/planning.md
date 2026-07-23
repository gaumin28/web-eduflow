# PLANNING — ONLINE COURSE MARKETPLACE

> **Stack:** ReactJS · TailwindCSS · NodeJS · ExpressJS · MongoDB · Mongoose · Cloudinary
> **Roles:** Guest · Customer · Provider · Admin

---

## PART 1 — DEVELOPMENT PLANNING

### Phase 1 — Foundation (Week 1–2)

| Task                | Description                                                       | Priority |
| ------------------- | ----------------------------------------------------------------- | -------- |
| Project scaffold    | Init repo, folder structure (client / server)                     | High     |
| Server setup        | ExpressJS + NodeJS boilerplate, middleware (cors, helmet, morgan) | High     |
| Database connection | MongoDB + Mongoose connect, env config                            | High     |
| Client setup        | ReactJS + TailwindCSS + React Router                              | High     |
| Auth module         | Register, Login, JWT (Access + Refresh Token), middleware         | High     |
| Email verification  | Send verify email on register                                     | High     |
| Forgot password     | Send reset link via email                                         | Medium   |
| Role system         | RBAC: Guest / Customer / Provider / Admin middleware              | High     |

---

### Phase 2 — Core Modules (Week 3–5)

| Task                        | Description                                                       | Priority |
| --------------------------- | ----------------------------------------------------------------- | -------- |
| User profile                | View/update profile, avatar upload (Cloudinary)                   | High     |
| Change password             | Authenticated password update                                     | Medium   |
| Category management (Admin) | CRUD categories (tree structure)                                  | High     |
| Provider registration flow  | Customer submits request → Admin approves/rejects                 | High     |
| Course CRUD (Provider)      | Create/Edit/Delete course with metadata                           | High     |
| Section & Lesson CRUD       | Add/Edit/Delete sections and lessons under course                 | High     |
| Media upload                | Upload video & documents to Cloudinary                            | High     |
| Course status workflow      | Draft → Pending Review → Published / Rejected / Hidden / Archived | High     |
| Course review (Admin)       | Approve / Reject pending courses                                  | High     |

---

### Phase 3 — Commerce & Learning (Week 6–8)

| Task                    | Description                                                     | Priority |
| ----------------------- | --------------------------------------------------------------- | -------- |
| Course listing & search | Full-text search, filter (category, price, level, rating), sort | High     |
| Course detail page      | Info, curriculum, reviews, preview lesson                       | High     |
| Wishlist                | Add/Remove course from wishlist                                 | Medium   |
| Cart                    | Add/Remove course, cart summary                                 | High     |
| Checkout & Payment      | Order creation, payment integration (VNPay/Stripe)              | High     |
| Enrollment              | Auto-enroll after successful payment                            | High     |
| Free course enrollment  | Direct enroll without payment                                   | Medium   |
| Order management        | Order history, order status                                     | Medium   |
| Learning player         | Video player, document viewer                                   | High     |
| Progress tracking       | Mark lesson complete, % completion per course                   | High     |

---

### Phase 4 — Engagement & Revenue (Week 9–10)

| Task                         | Description                                    | Priority |
| ---------------------------- | ---------------------------------------------- | -------- |
| Review & Rating              | Star rating + comment, 1 review per enrollment | High     |
| Revenue dashboard (Provider) | Earnings, enrollment count, course stats       | High     |
| Revenue split logic          | Platform takes 20%, Provider gets 80%          | High     |
| Notification system          | In-app notifications for key events            | Medium   |
| Admin dashboard              | Platform stats, user/course/revenue overview   | High     |
| User management (Admin)      | List, lock/unlock accounts                     | High     |
| Report management (Admin)    | Handle violation reports                       | Low      |

---

### Phase 5 — Polish & Deploy (Week 11–12)

| Task               | Description                                       | Priority |
| ------------------ | ------------------------------------------------- | -------- |
| Responsive UI      | Mobile-friendly all pages                         | High     |
| Input validation   | Server-side + client-side validation              | High     |
| Error handling     | Global error handler, meaningful error messages   | High     |
| Security hardening | XSS, CSRF, rate limiting, sanitization            | High     |
| Performance        | Pagination, query optimization, CDN for assets    | Medium   |
| Testing            | Unit tests (services), integration tests (APIs)   | Medium   |
| CI/CD setup        | GitHub Actions pipeline                           | Low      |
| Deployment         | Server deploy (VPS/Railway/Render), MongoDB Atlas | High     |

---

## PART 2 — API PLANNING

> Base URL: `/api/v1`
> Auth header: `Authorization: Bearer <access_token>`

---

### 2.1 Authentication

| Method | Endpoint                      | Auth     | Description                              |
| ------ | ----------------------------- | -------- | ---------------------------------------- |
| POST   | `/auth/register`              | Public   | Đăng ký tài khoản mới                    |
| POST   | `/auth/login`                 | Public   | Đăng nhập, trả về access + refresh token |
| POST   | `/auth/logout`                | Customer | Đăng xuất, revoke refresh token          |
| POST   | `/auth/refresh-token`         | Public   | Lấy access token mới từ refresh token    |
| GET    | `/auth/verify-email/:token`   | Public   | Xác minh email                           |
| POST   | `/auth/forgot-password`       | Public   | Gửi email đặt lại mật khẩu               |
| POST   | `/auth/reset-password/:token` | Public   | Đặt lại mật khẩu mới                     |

---

### 2.2 Users

| Method | Endpoint             | Auth     | Description                         |
| ------ | -------------------- | -------- | ----------------------------------- |
| GET    | `/users/me`          | Customer | Lấy thông tin profile hiện tại      |
| PUT    | `/users/me`          | Customer | Cập nhật thông tin profile          |
| PUT    | `/users/me/avatar`   | Customer | Cập nhật avatar (upload Cloudinary) |
| PUT    | `/users/me/password` | Customer | Đổi mật khẩu                        |
| GET    | `/users`             | Admin    | Danh sách tất cả người dùng         |
| GET    | `/users/:id`         | Admin    | Chi tiết người dùng                 |
| PATCH  | `/users/:id/status`  | Admin    | Khóa / mở khóa tài khoản            |

---

### 2.3 Providers

| Method | Endpoint                | Auth             | Description                         |
| ------ | ----------------------- | ---------------- | ----------------------------------- |
| POST   | `/providers/register`   | Customer         | Gửi yêu cầu trở thành Provider      |
| GET    | `/providers/me`         | Provider         | Lấy thông tin Provider của mình     |
| PUT    | `/providers/me`         | Provider         | Cập nhật hồ sơ Provider             |
| GET    | `/providers`            | Admin            | Danh sách tất cả Provider           |
| GET    | `/providers/:id`        | Admin            | Chi tiết Provider                   |
| PATCH  | `/providers/:id/status` | Admin            | Duyệt / Từ chối / Tạm khóa Provider |
| GET    | `/providers/:id/stats`  | Provider / Admin | Thống kê doanh thu, học viên        |

---

### 2.4 Categories

| Method | Endpoint          | Auth   | Description              |
| ------ | ----------------- | ------ | ------------------------ |
| GET    | `/categories`     | Public | Lấy toàn bộ cây danh mục |
| GET    | `/categories/:id` | Public | Chi tiết danh mục        |
| POST   | `/categories`     | Admin  | Tạo danh mục mới         |
| PUT    | `/categories/:id` | Admin  | Cập nhật danh mục        |
| DELETE | `/categories/:id` | Admin  | Xóa danh mục             |

---

### 2.5 Courses

| Method | Endpoint                 | Auth     | Description                                         |
| ------ | ------------------------ | -------- | --------------------------------------------------- |
| GET    | `/courses`               | Public   | Danh sách khóa học (search, filter, sort, paginate) |
| GET    | `/courses/:id`           | Public   | Chi tiết khóa học (kèm curriculum preview)          |
| POST   | `/courses`               | Provider | Tạo khóa học mới (Draft)                            |
| PUT    | `/courses/:id`           | Provider | Cập nhật thông tin khóa học                         |
| DELETE | `/courses/:id`           | Provider | Xóa khóa học (chỉ khi chưa có enrollment)           |
| POST   | `/courses/:id/submit`    | Provider | Gửi khóa học lên review                             |
| PATCH  | `/courses/:id/status`    | Admin    | Duyệt / Từ chối / Ẩn / Lưu trữ                      |
| PUT    | `/courses/:id/thumbnail` | Provider | Upload thumbnail (Cloudinary)                       |
| GET    | `/courses/my`            | Provider | Danh sách khóa học của Provider                     |

---

### 2.6 Sections & Lessons

| Method | Endpoint                                 | Auth     | Description                    |
| ------ | ---------------------------------------- | -------- | ------------------------------ |
| POST   | `/courses/:courseId/sections`            | Provider | Tạo section mới                |
| PUT    | `/courses/:courseId/sections/:sectionId` | Provider | Cập nhật section               |
| DELETE | `/courses/:courseId/sections/:sectionId` | Provider | Xóa section                    |
| PATCH  | `/courses/:courseId/sections/reorder`    | Provider | Sắp xếp lại thứ tự section     |
| POST   | `/sections/:sectionId/lessons`           | Provider | Tạo bài học mới                |
| PUT    | `/sections/:sectionId/lessons/:lessonId` | Provider | Cập nhật bài học               |
| DELETE | `/sections/:sectionId/lessons/:lessonId` | Provider | Xóa bài học                    |
| POST   | `/lessons/:lessonId/upload-video`        | Provider | Upload video lên Cloudinary    |
| POST   | `/lessons/:lessonId/upload-document`     | Provider | Upload tài liệu lên Cloudinary |

---

### 2.7 Wishlist

| Method | Endpoint              | Auth     | Description                   |
| ------ | --------------------- | -------- | ----------------------------- |
| GET    | `/wishlist`           | Customer | Lấy danh sách khóa học đã lưu |
| POST   | `/wishlist/:courseId` | Customer | Thêm khóa học vào wishlist    |
| DELETE | `/wishlist/:courseId` | Customer | Xóa khóa học khỏi wishlist    |

---

### 2.8 Cart

| Method | Endpoint          | Auth     | Description                |
| ------ | ----------------- | -------- | -------------------------- |
| GET    | `/cart`           | Customer | Lấy giỏ hàng hiện tại      |
| POST   | `/cart/:courseId` | Customer | Thêm khóa học vào giỏ hàng |
| DELETE | `/cart/:courseId` | Customer | Xóa khóa học khỏi giỏ hàng |
| DELETE | `/cart`           | Customer | Xóa toàn bộ giỏ hàng       |

---

### 2.9 Orders & Payment

| Method | Endpoint              | Auth             | Description                         |
| ------ | --------------------- | ---------------- | ----------------------------------- |
| POST   | `/orders`             | Customer         | Tạo đơn hàng từ cart                |
| GET    | `/orders`             | Customer         | Lịch sử đơn hàng                    |
| GET    | `/orders/:id`         | Customer         | Chi tiết đơn hàng                   |
| POST   | `/orders/:id/payment` | Customer         | Khởi tạo thanh toán (VNPay/Stripe)  |
| POST   | `/payment/webhook`    | Public           | Webhook callback từ payment gateway |
| POST   | `/orders/:id/refund`  | Customer / Admin | Yêu cầu hoàn tiền                   |
| GET    | `/orders/admin`       | Admin            | Tất cả đơn hàng hệ thống            |

---

### 2.10 Enrollments

| Method | Endpoint                                            | Auth             | Description                   |
| ------ | --------------------------------------------------- | ---------------- | ----------------------------- |
| GET    | `/enrollments/my`                                   | Customer         | Danh sách khóa học đã mua     |
| GET    | `/enrollments/:courseId`                            | Customer         | Chi tiết enrollment + tiến độ |
| POST   | `/enrollments/:courseId/free`                       | Customer         | Đăng ký khóa học miễn phí     |
| PATCH  | `/enrollments/:courseId/lessons/:lessonId/complete` | Customer         | Đánh dấu bài học hoàn thành   |
| GET    | `/courses/:courseId/enrollments`                    | Provider / Admin | Danh sách học viên đã đăng ký |

---

### 2.11 Reviews

| Method | Endpoint                               | Auth     | Description                     |
| ------ | -------------------------------------- | -------- | ------------------------------- |
| GET    | `/courses/:courseId/reviews`           | Public   | Danh sách đánh giá của khóa học |
| POST   | `/courses/:courseId/reviews`           | Customer | Tạo đánh giá (cần đã mua)       |
| PUT    | `/courses/:courseId/reviews/:reviewId` | Customer | Cập nhật đánh giá của mình      |
| DELETE | `/courses/:courseId/reviews/:reviewId` | Admin    | Xóa đánh giá vi phạm            |

---

### 2.12 Notifications

| Method | Endpoint                  | Auth     | Description             |
| ------ | ------------------------- | -------- | ----------------------- |
| GET    | `/notifications`          | Customer | Lấy danh sách thông báo |
| PATCH  | `/notifications/:id/read` | Customer | Đánh dấu đã đọc         |
| PATCH  | `/notifications/read-all` | Customer | Đánh dấu tất cả đã đọc  |

---

### 2.13 Admin — Revenue

| Method | Endpoint                   | Auth  | Description                                 |
| ------ | -------------------------- | ----- | ------------------------------------------- |
| GET    | `/admin/revenue`           | Admin | Tổng doanh thu theo ngày/tháng              |
| GET    | `/admin/revenue/providers` | Admin | Doanh thu theo từng Provider                |
| GET    | `/admin/stats`             | Admin | Tổng quan hệ thống (users, courses, orders) |

---

## PART 3 — DATABASE PLANNING

### 3.1 Collection: `users`

```json
{
  "_id": "ObjectId",
  "email": "string (unique, required)",
  "password": "string (hashed, required)",
  "role": ["customer", "provider", "admin"],
  "isEmailVerified": "boolean (default: false)",
  "isActive": "boolean (default: true)",
  "name": "string",
  "avatar": "string (Cloudinary URL)",
  "bio": "string",
  "emailVerifyToken": "string",
  "resetPasswordToken": "string",
  "resetPasswordExpires": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

### 3.2 Collection: `refreshTokens`

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "token": "string (hashed)",
  "expiresAt": "Date",
  "createdAt": "Date"
}
```

---

### 3.3 Collection: `providers`

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users, unique)",
  "displayName": "string (required)",
  "bio": "string",
  "avatar": "string (Cloudinary URL)",
  "contact": {
    "website": "string",
    "facebook": "string",
    "linkedin": "string"
  },
  "status": "enum: [pending, approved, rejected, suspended]",
  "totalRevenue": "number (default: 0)",
  "balance": "number (default: 0)",
  "adminNote": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

### 3.4 Collection: `categories`

```json
{
  "_id": "ObjectId",
  "name": "string (required)",
  "slug": "string (unique)",
  "parentId": "ObjectId | null (ref: categories)",
  "description": "string",
  "isActive": "boolean (default: true)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

### 3.5 Collection: `courses`

```json
{
  "_id": "ObjectId",
  "providerId": "ObjectId (ref: providers, required)",
  "title": "string (required)",
  "slug": "string (unique)",
  "description": "string",
  "thumbnail": "string (Cloudinary URL)",
  "previewVideo": "string (Cloudinary URL)",
  "categoryId": "ObjectId (ref: categories)",
  "level": "enum: [beginner, intermediate, advanced]",
  "language": "string",
  "price": "number (default: 0, min: 0)",
  "isFree": "boolean (default: false)",
  "status": "enum: [draft, pending_review, published, rejected, hidden, archived]",
  "objectives": ["string"],
  "requirements": ["string"],
  "tags": ["string"],
  "totalDuration": "number (seconds)",
  "totalLessons": "number",
  "totalEnrollments": "number (default: 0)",
  "averageRating": "number (default: 0)",
  "totalReviews": "number (default: 0)",
  "adminNote": "string",
  "publishedAt": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

### 3.6 Collection: `sections`

```json
{
  "_id": "ObjectId",
  "courseId": "ObjectId (ref: courses, required)",
  "title": "string (required)",
  "order": "number (required)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

### 3.7 Collection: `lessons`

```json
{
  "_id": "ObjectId",
  "sectionId": "ObjectId (ref: sections, required)",
  "courseId": "ObjectId (ref: courses, required)",
  "title": "string (required)",
  "type": "enum: [video, document]",
  "order": "number (required)",
  "isPreview": "boolean (default: false)",
  "content": {
    "videoUrl": "string (Cloudinary URL)",
    "duration": "number (seconds)",
    "documentUrl": "string (Cloudinary URL)",
    "documentType": "enum: [pdf, pptx, docx]"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

### 3.8 Collection: `orders`

```json
{
  "_id": "ObjectId",
  "customerId": "ObjectId (ref: users, required)",
  "items": [
    {
      "courseId": "ObjectId (ref: courses)",
      "title": "string",
      "price": "number",
      "providerId": "ObjectId (ref: providers)"
    }
  ],
  "totalAmount": "number (required)",
  "status": "enum: [pending, paid, failed, refunded]",
  "paymentMethod": "string",
  "paymentRef": "string",
  "paidAt": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

### 3.9 Collection: `enrollments`

```json
{
  "_id": "ObjectId",
  "customerId": "ObjectId (ref: users, required)",
  "courseId": "ObjectId (ref: courses, required)",
  "orderId": "ObjectId (ref: orders)",
  "completedLessons": ["ObjectId (ref: lessons)"],
  "progressPercent": "number (default: 0, min: 0, max: 100)",
  "isCompleted": "boolean (default: false)",
  "completedAt": "Date",
  "enrolledAt": "Date",
  "updatedAt": "Date"
}
```

**Index:** `{ customerId, courseId }` — unique

---

### 3.10 Collection: `reviews`

```json
{
  "_id": "ObjectId",
  "customerId": "ObjectId (ref: users, required)",
  "courseId": "ObjectId (ref: courses, required)",
  "rating": "number (required, min: 1, max: 5)",
  "comment": "string",
  "isHidden": "boolean (default: false)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**Index:** `{ customerId, courseId }` — unique

---

### 3.11 Collection: `wishlists`

```json
{
  "_id": "ObjectId",
  "customerId": "ObjectId (ref: users, unique)",
  "courses": ["ObjectId (ref: courses)"],
  "updatedAt": "Date"
}
```

---

### 3.12 Collection: `carts`

```json
{
  "_id": "ObjectId",
  "customerId": "ObjectId (ref: users, unique)",
  "courses": ["ObjectId (ref: courses)"],
  "updatedAt": "Date"
}
```

---

### 3.13 Collection: `notifications`

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users, required)",
  "type": "enum: [payment_success, course_approved, course_rejected, provider_approved, provider_rejected, new_enrollment, new_review, course_updated]",
  "title": "string",
  "message": "string",
  "isRead": "boolean (default: false)",
  "metadata": {
    "courseId": "ObjectId",
    "orderId": "ObjectId"
  },
  "createdAt": "Date"
}
```

---

### 3.14 Collection: `revenueTransactions`

```json
{
  "_id": "ObjectId",
  "orderId": "ObjectId (ref: orders)",
  "courseId": "ObjectId (ref: courses)",
  "providerId": "ObjectId (ref: providers)",
  "grossAmount": "number",
  "platformFee": "number",
  "providerAmount": "number",
  "status": "enum: [pending, settled, refunded]",
  "settledAt": "Date",
  "createdAt": "Date"
}
```

---

### 3.15 Entity Relationship Overview

```
users ──────────────────── providers (1:1)
  │                              │
  │                           courses (1:N)
  │                              │
  ├── enrollments (N:M) ─────────┤
  │        │                  sections (1:N)
  │        │                     │
  │    completedLessons        lessons (1:N)
  │
  ├── orders (1:N)
  │        │
  │    orderItems ──────────── courses
  │
  ├── reviews (N:M) ─────────── courses
  │
  ├── wishlists (1:1) ────────── courses[]
  │
  ├── carts (1:1) ────────────── courses[]
  │
  └── notifications (1:N)
```

---

## PART 4 — FOLDER STRUCTURE

### Backend (`/server`)

```
server/
├── src/
│   ├── config/          # DB, Cloudinary, env config
│   ├── middlewares/     # auth, role, validate, error handler
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── providers/
│   │   ├── categories/
│   │   ├── courses/
│   │   ├── sections/
│   │   ├── lessons/
│   │   ├── orders/
│   │   ├── enrollments/
│   │   ├── reviews/
│   │   ├── wishlist/
│   │   ├── cart/
│   │   ├── notifications/
│   │   └── admin/
│   ├── utils/           # helpers, cloudinary upload, email sender
│   └── app.js
├── .env
└── package.json
```

Each module follows:

```
module/
├── module.route.js
├── module.controller.js
├── module.service.js
├── module.model.js
└── module.validation.js
```

---

### Frontend (`/client`)

```
client/
├── src/
│   ├── assets/
│   ├── components/      # Shared UI components
│   ├── layouts/         # MainLayout, DashboardLayout, AdminLayout
│   ├── pages/
│   │   ├── auth/        # Login, Register, ForgotPassword
│   │   ├── home/
│   │   ├── courses/     # List, Detail, Player
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── dashboard/   # Customer dashboard
│   │   ├── provider/    # Provider management
│   │   └── admin/       # Admin panels
│   ├── hooks/           # Custom React hooks
│   ├── services/        # Axios API calls
│   ├── store/           # State management (Redux / Zustand)
│   ├── utils/
│   └── App.jsx
└── package.json
```

---

## PART 5 — BUSINESS RULES SUMMARY

| Code   | Rule                                                             |
| ------ | ---------------------------------------------------------------- |
| BR-U01 | Email phải được xác minh trước khi mua/tạo khóa học              |
| BR-U02 | Một email chỉ đăng ký được một tài khoản duy nhất                |
| BR-U03 | Tài khoản bị khóa không thể đăng nhập; dữ liệu giữ nguyên        |
| BR-P01 | Chỉ Customer đã xác minh email mới gửi được yêu cầu làm Provider |
| BR-P02 | Provider phải được Admin duyệt trước khi tạo khóa học            |
| BR-C01 | Khóa học chỉ hiển thị public khi ở trạng thái Published          |
| BR-C02 | Khóa học không thể xóa nếu đã có enrollment                      |
| BR-C03 | Giá khóa học >= 0; price = 0 tương đương miễn phí                |
| BR-C04 | Provider không thể tự duyệt khóa học của mình                    |
| BR-E01 | Customer không thể mua lại khóa học đã sở hữu                    |
| BR-E02 | Quyền truy cập khóa học là vĩnh viễn sau khi mua                 |
| BR-R01 | Chỉ Customer đã mua mới được đánh giá khóa học                   |
| BR-R02 | Mỗi Customer chỉ có 1 đánh giá/khóa học (có thể cập nhật)        |
| BR-R03 | Giảng viên không thể xóa đánh giá; chỉ Admin có quyền            |
| BR-F01 | Chia doanh thu: Provider 80% — Platform 20%                      |
