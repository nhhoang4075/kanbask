# Project Management System - Product Backlog

## 1. Project Overview

**Tên dự án:** Kanbask - Hệ thống quản lý dự án và làm việc nhóm

Kanbask là một nền tảng quản lý dự án hỗ trợ các cá nhân và nhóm làm việc cộng tác, giao tiếp và theo dõi tiến độ công việc hiệu quả. Hệ thống cung cấp các chức năng như quản lý nhiệm vụ, bảng Kanban, chat nhóm và quản lý thành viên dự án.

## 2. Key Features

### a. Communication & Collaboration

- **One-one Chat:** Nhắn tin trực tiếp giữa các thành viên.
- **Team Chat:** Nhóm chat chung cho toàn bộ team.
- **Project Chat:** Nhóm chat riêng cho các thành viên của mỗi dự án.
- **Notification System:** Gửi thông báo khi có cập nhật quan trọng.
- **Media Sharing:** Truyền tải media như ảnh, video, file trong chat.
- **Message Search:** Tìm kiếm đoạn tin nhắn trong cuộc trò chuyện.

### b. Project & Task Management

- **Task Management:** Tạo, phân công và theo dõi trạng thái của các nhiệm vụ.
- **Kanban Board:** Quản lý nhiệm vụ thông qua bảng Kanban.
- **Calendar View:** Xem lịch trình nhiệm vụ theo ngày/tháng.
- **Task Commenting:** Cho phép người dùng bình luận trực tiếp trên từng nhiệm vụ.
- **Task Searching:** Tìm kiếm nhiệm vụ theo tên, trạng thái hoặc người thực hiện.
- **Log Tracking:** Theo dõi lịch sử chỉnh sửa và hoạt động trong dự án.
- **Dashboard:** Hiển thị các thông số của dự án, ví dụ tiến độ hoàn thành nhiệm vụ.

### c. User & Team Management

- **User Profile:** Hiển thị và chỉnh sửa thông tin cá nhân của người dùng.
- **Team Management:** Phân quyền và quản lý thành viên trong team.
- **Project Members Management:** Phân chia và quản lý thành viên cho các dự án.

### d. File & Documentation

- **Docs Management:** Tạo và quản lý cấu trúc tài liệu dự án.
- **File Upload/Download:** Cho phép tải lên và tải xuống các file liên quan đến dự án.

## 3. Tech Stack

| Component            | Technology                              |
| -------------------- | --------------------------------------- |
| **Frontend**         | Next.js (React Framework), Tailwind CSS |
| **Backend**          | Express.js                              |
| **Database**         | NeonDB (Serverless Postgres Database)   |
| **Authentication**   | JWT                                     |
| **Real-time**        | Socket.IO                               |
| **Containerization** | Docker                                  |
| **Deployment**       | Contabo, GitLab                         |
| **Version Control**  | Git, GitHub                             |
