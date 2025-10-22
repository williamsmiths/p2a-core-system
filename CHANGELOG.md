# Changelog

All notable changes to the P2A Core System will be documented in this file.

## [1.0.0] - 2025-10-21

### Added
- ✨ Initial release of P2A Core System
- 🔐 JWT Authentication với Access & Refresh Tokens
- 👥 User Management với 7 roles (Admin, University, Company, Student, Alumni, Researcher, Startup)
- ✉️ Email Verification System với Nodemailer
- 📧 Email templates cho verification và welcome
- 🗄️ PostgreSQL Master/Slave configuration với TypeORM
- 🛡️ Role-based Access Control (RBAC)
- 🌍 UTC Timezone strategy
- 📝 Chuẩn response format cho tất cả APIs
- 🔒 Security features:
  - Password hashing với bcrypt
  - Rate limiting
  - CORS configuration
  - Helmet middleware
  - Input validation
- 📚 Swagger/OpenAPI documentation
- 🐳 Docker & Docker Compose support
- 🏥 Health check endpoint
- 📖 Comprehensive documentation (README, SETUP, API-EXAMPLES)

### Database Schema
- `users` - Thông tin xác thực và vai trò
- `user_profiles` - Thông tin chi tiết người dùng
- `email_verifications` - Token xác thực email
- `refresh_tokens` - Quản lý refresh tokens

### API Endpoints

#### Auth
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/verify-email` - Xác thực email
- `GET /api/auth/verify-email` - Xác thực email qua query
- `POST /api/auth/resend-verification` - Gửi lại email xác thực
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Đăng xuất

#### Users
- `GET /api/users/me` - Lấy profile của user hiện tại
- `PATCH /api/users/me` - Cập nhật profile
- `POST /api/users/me/change-password` - Đổi mật khẩu
- `GET /api/users/:id` - Lấy thông tin user khác
- `GET /api/users` - Lấy danh sách users (Admin only)
- `POST /api/users/:id/deactivate` - Khóa tài khoản (Admin only)
- `POST /api/users/:id/activate` - Kích hoạt tài khoản (Admin only)

#### Health
- `GET /api/health` - Health check

### Technical Stack
- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 15
- **ORM**: TypeORM 0.3.x
- **Authentication**: JWT, Passport.js
- **Validation**: class-validator, class-transformer
- **Email**: Nodemailer
- **Documentation**: Swagger/OpenAPI
- **Container**: Docker

### Security
- Password hashing với bcrypt (10 salt rounds)
- JWT expiration: 7 days (configurable)
- Refresh token expiration: 30 days (configurable)
- Rate limiting: 10 requests/minute
- CORS enabled với whitelist
- SQL injection protection via TypeORM
- XSS protection via Helmet

---

## [Future Releases]

### Planned Features
- [ ] Password reset functionality
- [ ] Social login (Google, Facebook)
- [ ] Two-factor authentication (2FA)
- [ ] Admin dashboard
- [ ] User activity logs
- [ ] Email notifications
- [ ] File upload (avatar, documents)
- [ ] Pagination helpers
- [ ] Search & filtering
- [ ] Export data (CSV, Excel)

---

**Note**: Semantic versioning (SemVer) được sử dụng: MAJOR.MINOR.PATCH

