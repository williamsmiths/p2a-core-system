# P2A ASEAN Core System Module

## 📋 Mô tả

Module Core System là hệ thống lõi của P2A ASEAN Platform, cung cấp các chức năng cơ bản:
- 🔐 Authentication & Authorization với JWT
- 👥 User Management
- ✉️ Email Verification
- 🔄 Refresh Token
- 🛡️ Role-based Access Control (RBAC)
- 🌍 Internationalization (i18n) - 5 ngôn ngữ ASEAN

## 🏗️ Kiến trúc

### Công nghệ sử dụng
- **Framework**: NestJS 10.x
- **Database**: PostgreSQL 15 với TypeORM
- **Authentication**: JWT (Passport.js)
- **Email**: Nodemailer
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **i18n**: nestjs-i18n (Vietnamese, English, Thai, Indonesian, Malay)

### Cấu trúc thư mục

```
src/
├── common/                    # Shared modules
│   ├── decorators/           # Custom decorators
│   ├── enums/               # Enums (UserRole, etc.)
│   ├── exceptions/          # Custom exceptions
│   ├── filters/             # Exception filters
│   └── interceptors/        # Response interceptors
├── config/                   # Configuration files
│   ├── app.config.ts
│   ├── database.config.ts   # Master/Slave config
│   ├── jwt.config.ts
│   └── mail.config.ts
├── database/
│   └── entities/            # TypeORM entities
│       ├── user.entity.ts
│       ├── user-profile.entity.ts
│       ├── email-verification.entity.ts
│       └── refresh-token.entity.ts
├── modules/
│   ├── auth/                # Authentication module
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/               # User management module
│   │   ├── dto/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   └── email/               # Email service module
│       ├── email.service.ts
│       └── email.module.ts
├── health/                  # Health check
├── app.module.ts
└── main.ts

```

## 🚀 Cài đặt

### Prerequisites
- Node.js >= 20.x
- PostgreSQL >= 15
- npm hoặc yarn

### Bước 1: Clone và cài đặt dependencies

```bash
cd p2a-core-system
npm install
```

### Bước 2: Cấu hình Environment

Copy file `.env.development` và chỉnh sửa các thông số:

```bash
cp .env.development .env
```

Các biến môi trường quan trọng:

```env
# Database
DB_MASTER_HOST=localhost
DB_MASTER_PORT=5432
DB_MASTER_USERNAME=p2a_user
DB_MASTER_PASSWORD=your_password
DB_MASTER_DATABASE=p2a_core

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Email (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Bước 3: Chạy ứng dụng

**Development mode:**
```bash
npm run start:dev
```

**Production mode:**
```bash
npm run build
npm run start:prod
```

**Với Docker:**
```bash
docker-compose up -d
```

## 📚 API Documentation

Sau khi chạy ứng dụng ở development mode, truy cập Swagger UI tại:

```
http://localhost:3000/api/docs
```

## 🌍 Internationalization (i18n)

Hệ thống hỗ trợ đa ngôn ngữ cho cộng đồng ASEAN:

- 🇻🇳 **Vietnamese (vi)** - Tiếng Việt
- 🇺🇸 **English (en)** - English (default)
- 🇹🇭 **Thai (th)** - ไทย
- 🇮🇩 **Indonesian (id)** - Bahasa Indonesia
- 🇲🇾 **Malay (ms)** - Bahasa Melayu

### Cách sử dụng:

**1. Query Parameter:**
```bash
curl "http://localhost:3000/api/users/me?lang=vi"
```

**2. Accept-Language Header:**
```bash
curl -H "Accept-Language: vi-VN,vi;q=0.9,en;q=0.8" \
  http://localhost:3000/api/users/me
```

**3. Response sẽ tự động translate (chỉ khi có lỗi):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Email không hợp lệ",  // Vietnamese
  "timestamp": "2025-10-21T10:30:00.000Z"
}
```

Xem chi tiết: [I18N-GUIDE.md](I18N-GUIDE.md)

## 🔑 Authentication Flow

### 1. Đăng ký tài khoản

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123",
  "role": "student",
  "fullName": "Nguyen Van A"
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "student",
      "isEmailVerified": false
    }
  }
}
```

### 2. Xác thực Email

```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification-token-from-email"
}
```

### 3. Đăng nhập

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "uuid-refresh-token",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "student",
      "isEmailVerified": true
    }
  }
}
```

### 4. Sử dụng Access Token

```http
GET /api/users/me
Authorization: Bearer eyJhbGc...
```

### 5. Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "uuid-refresh-token"
}
```

## 👥 User Roles

Hệ thống hỗ trợ 7 vai trò người dùng:

| Role | Enum Value | Mô tả |
|------|-----------|-------|
| Admin | `admin` | Quản trị viên tối cao |
| University | `university` | Đại diện trường đại học |
| Company | `company` | Đại diện doanh nghiệp |
| Student | `student` | Sinh viên |
| Alumni | `alumni` | Cựu sinh viên |
| Researcher | `researcher` | Nhà nghiên cứu |
| Startup | `startup` | Công ty khởi nghiệp |

## 🔐 Authorization

Sử dụng `@Roles()` decorator để phân quyền:

```typescript
@Get('admin/users')
  @Roles(UserRole.ADMIN)
async getAllUsers() {
  // Chỉ ADMIN mới truy cập được
  }

@Post('internships')
  @Roles(UserRole.COMPANY, UserRole.ALUMNI)
async createInternship() {
  // COMPANY và ALUMNI có thể truy cập
}
```

## 🗄️ Database

### Schema

**users** table:
- `id` (UUID, PK)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `role` (ENUM)
- `is_active` (BOOLEAN)
- `is_email_verified` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMPTZ)

**user_profiles** table:
- `user_id` (UUID, PK, FK)
- `full_name` (VARCHAR)
- `avatar_url`, `phone_number`, `country`, `city`, `bio`
- `date_of_birth`, `gender`
- `linkedin_url`, `website_url`
- `created_at`, `updated_at` (TIMESTAMPTZ)

**email_verifications** table:
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `token` (VARCHAR, UNIQUE)
- `status` (ENUM)
- `expires_at` (TIMESTAMPTZ)

**refresh_tokens** table:
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `token` (VARCHAR, UNIQUE)
- `expires_at` (TIMESTAMPTZ)
- `is_revoked` (BOOLEAN)

### PostgreSQL Master/Slave Configuration

TypeORM hỗ trợ replication tự động:

```typescript
// config/database.config.ts
replication: {
  master: {
    host: 'master-db-host',
    port: 5432,
    // ...
  },
  slaves: [{
    host: 'slave-db-host',
    port: 5432,
    // ...
  }]
}
```

- **Master**: Xử lý tất cả INSERT, UPDATE, DELETE
- **Slave**: Xử lý tất cả SELECT queries
- TypeORM tự động route queries đến đúng database

## 🌍 Timezone Strategy

Hệ thống **luôn luôn** sử dụng UTC timezone:

- Database: `TIMESTAMPTZ` type, lưu trữ UTC
- Backend: Mọi logic xử lý ngày giờ ở UTC
- Frontend: Chịu trách nhiệm hiển thị theo timezone địa phương

```typescript
// main.ts
process.env.TZ = 'UTC';

// Entity
@CreateDateColumn({ type: 'timestamptz' })
createdAt: Date; // Tự động lưu dưới dạng UTC
```

## 📧 Email Templates

Email được gửi tự động cho:
- Xác thực email khi đăng ký
- Chào mừng sau khi verify thành công
- Reset mật khẩu (planned)

Cấu hình SMTP trong `.env`:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

**Lưu ý**: Với Gmail, cần tạo App Password thay vì dùng mật khẩu thường.

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Docker Deployment

### Build image:

```bash
docker build -t p2a-core-system:latest .
```

### Run với docker-compose:

```bash
docker-compose up -d
```

Services included:
- `app`: NestJS application (port 3000)
- `postgres`: PostgreSQL database (port 5432)
- `pgadmin`: Database management UI (port 5050)

## 🔧 Development Scripts

```bash
# Development
npm run start:dev          # Start với hot-reload
npm run build             # Build production
npm run start:prod        # Start production

# Code quality
npm run lint              # ESLint
npm run format            # Prettier

# Docker
./scripts/docker-dev.sh   # Start Docker Compose
```

## 📝 Response Format

Tất cả API response đều có format chuẩn:

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": { ... },
  "timestamp": "2025-10-21T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Lỗi...",
  "errors": [...],
  "timestamp": "2025-10-21T10:30:00.000Z",
  "path": "/api/auth/login"
}
```

> **Lưu ý**: Success response **KHÔNG có** field `message`, chỉ error response mới có.

Xem chi tiết: [RESPONSE-FORMAT.md](RESPONSE-FORMAT.md)

## 🛡️ Security

- ✅ Password hashing với bcrypt (salt rounds: 10)
- ✅ JWT với expiration
- ✅ Refresh token rotation
- ✅ Rate limiting (10 req/min)
- ✅ CORS configuration
- ✅ Helmet middleware
- ✅ Input validation với class-validator
- ✅ SQL injection protection (TypeORM)

## 📖 Best Practices

1. **Không dùng `throw new Error()`** - Sử dụng custom exceptions
2. **Không tạo migrations** - Dùng TypeORM synchronize
3. **Luôn validate input** - Dùng DTO với class-validator
4. **Timezone UTC** - Mọi thao tác ngày giờ ở UTC
5. **Response chuẩn** - Dùng TransformInterceptor
6. **Logging** - Log mọi thao tác quan trọng

## 🤝 Contributing

1. Tạo branch mới từ `main`
2. Implement feature/fix
3. Viết tests
4. Tạo Pull Request

## 📄 License

MIT License

---

**Developed by P2A ASEAN Team** 🎓
```