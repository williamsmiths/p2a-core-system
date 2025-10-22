# 📚 API Examples - P2A Core System

## Base URL
```
http://localhost:3000/api
```

## Authentication Header
Hầu hết các endpoints yêu cầu JWT token trong header:
```
Authorization: Bearer <access_token>
```

---

## 1. Auth Endpoints

### 1.1. Đăng ký tài khoản

```bash
POST /auth/register
```

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "Student123",
  "role": "student",
  "fullName": "Nguyen Van A"
}
```

**Roles có thể sử dụng:**
- `admin` - Quản trị viên
- `university` - Đại học
- `company` - Doanh nghiệp
- `student` - Sinh viên
- `alumni` - Cựu sinh viên
- `researcher` - Nhà nghiên cứu
- `startup` - Startup

**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "student@example.com",
      "role": "student",
      "isActive": true,
      "isEmailVerified": false,
      "createdAt": "2025-10-21T10:30:00.000Z",
      "updatedAt": "2025-10-21T10:30:00.000Z"
    }
  },
  "timestamp": "2025-10-21T10:30:00.000Z"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "Student123",
    "role": "student",
    "fullName": "Nguyen Van A"
  }'
```

---

### 1.2. Xác thực Email

**Option 1: POST với token trong body**
```bash
POST /auth/verify-email
```

**Request Body:**
```json
{
  "token": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Option 2: GET với token trong query (từ link trong email)**
```bash
GET /auth/verify-email?token=550e8400-e29b-41d4-a716-446655440001
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "timestamp": "2025-10-21T10:35:00.000Z"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "550e8400-e29b-41d4-a716-446655440001"}'
```

---

### 1.3. Gửi lại Email xác thực

```bash
POST /auth/resend-verification
```

**Request Body:**
```json
{
  "email": "student@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "timestamp": "2025-10-21T10:40:00.000Z"
}
```

---

### 1.4. Đăng nhập

```bash
POST /auth/login
```

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "Student123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440002",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "student@example.com",
      "role": "student",
      "isEmailVerified": true,
      "profile": {
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "fullName": "Nguyen Van A",
        "avatarUrl": null,
        "phoneNumber": null,
        "country": null,
        "city": null,
        "bio": null
      }
    }
  },
  "timestamp": "2025-10-21T10:45:00.000Z"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "Student123"
  }'
```

---

### 1.5. Refresh Access Token

```bash
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2025-10-21T11:00:00.000Z"
}
```

---

### 1.6. Đăng xuất

```bash
POST /auth/logout
```

**Request Body:**
```json
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "message": "Đăng xuất thành công"
  },
  "timestamp": "2025-10-21T11:05:00.000Z"
}
```

---

## 2. User Endpoints

**🔒 Tất cả endpoints dưới đây yêu cầu JWT token**

### 2.1. Lấy thông tin profile của mình

```bash
GET /users/me
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "student@example.com",
      "role": "student",
      "isActive": true,
      "isEmailVerified": true,
      "emailVerifiedAt": "2025-10-21T10:35:00.000Z",
      "lastLoginAt": "2025-10-21T10:45:00.000Z",
      "createdAt": "2025-10-21T10:30:00.000Z",
      "updatedAt": "2025-10-21T10:45:00.000Z",
      "profile": {
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "fullName": "Nguyen Van A",
        "avatarUrl": null,
        "phoneNumber": null,
        "country": null,
        "city": null,
        "bio": null,
        "dateOfBirth": null,
        "gender": null,
        "linkedinUrl": null,
        "websiteUrl": null,
        "createdAt": "2025-10-21T10:30:00.000Z",
        "updatedAt": "2025-10-21T10:30:00.000Z"
      }
    }
  },
  "timestamp": "2025-10-21T11:10:00.000Z"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <access_token>"
```

---

### 2.2. Cập nhật profile

```bash
PATCH /users/me
Authorization: Bearer <access_token>
```

**Request Body (tất cả fields đều optional):**
```json
{
  "fullName": "Nguyen Van A",
  "phoneNumber": "+84 901234567",
  "country": "Vietnam",
  "city": "Ho Chi Minh",
  "bio": "Sinh viên năm 3 ngành Công nghệ Thông tin",
  "dateOfBirth": "2002-05-15",
  "gender": "male",
  "linkedinUrl": "https://linkedin.com/in/nguyen-van-a",
  "websiteUrl": "https://nguyenvana.dev",
  "avatarUrl": "https://example.com/avatars/user123.jpg"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Cập nhật profile thành công",
  "data": {
    "profile": {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "fullName": "Nguyen Van A",
      "phoneNumber": "+84 901234567",
      "country": "Vietnam",
      "city": "Ho Chi Minh",
      "bio": "Sinh viên năm 3 ngành Công nghệ Thông tin",
      "dateOfBirth": "2002-05-15",
      "gender": "male",
      "linkedinUrl": "https://linkedin.com/in/nguyen-van-a",
      "websiteUrl": "https://nguyenvana.dev",
      "avatarUrl": "https://example.com/avatars/user123.jpg",
      "updatedAt": "2025-10-21T11:15:00.000Z"
    }
  },
  "timestamp": "2025-10-21T11:15:00.000Z"
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nguyen Van A",
    "phoneNumber": "+84 901234567",
    "country": "Vietnam",
    "city": "Ho Chi Minh",
    "bio": "Sinh viên năm 3 ngành Công nghệ Thông tin"
  }'
```

---

### 2.3. Đổi mật khẩu

```bash
POST /users/me/change-password
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "currentPassword": "Student123",
  "newPassword": "NewPassword456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "timestamp": "2025-10-21T11:20:00.000Z"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/users/me/change-password \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Student123",
    "newPassword": "NewPassword456"
  }'
```

---

### 2.4. Lấy thông tin user khác (Public profile)

```bash
GET /users/:id
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "email": "other@example.com",
      "role": "company",
      "isActive": true,
      "isEmailVerified": true,
      "createdAt": "2025-10-20T10:30:00.000Z",
      "profile": {
        "fullName": "ABC Company",
        "bio": "Leading tech company",
        "websiteUrl": "https://abc-company.com"
      }
    }
  },
  "timestamp": "2025-10-21T11:25:00.000Z"
}
```

---

## 3. Admin Endpoints

**🔒 Chỉ user có role ADMIN mới truy cập được**

### 3.1. Lấy danh sách tất cả users

```bash
GET /users?page=1&limit=10
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**
- `page` (optional, default: 1) - Số trang
- `limit` (optional, default: 10) - Số record mỗi trang

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "student@example.com",
        "role": "student",
        "isActive": true,
        "isEmailVerified": true,
        "profile": {
          "fullName": "Nguyen Van A"
        }
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  },
  "timestamp": "2025-10-21T11:30:00.000Z"
}
```

---

### 3.2. Khóa tài khoản user

```bash
POST /users/:id/deactivate
Authorization: Bearer <admin_access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "timestamp": "2025-10-21T11:35:00.000Z"
}
```

---

### 3.3. Kích hoạt lại tài khoản user

```bash
POST /users/:id/activate
Authorization: Bearer <admin_access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "timestamp": "2025-10-21T11:40:00.000Z"
}
```

---

## 4. Error Responses

### 4.1. Validation Error (422 Unprocessable Entity)

```json
{
  "success": false,
  "statusCode": 422,
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    "Email không hợp lệ",
    "Mật khẩu phải có ít nhất 8 ký tự",
    "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
  ],
  "timestamp": "2025-10-21T12:00:00.000Z",
  "path": "/api/auth/register"
}
```

### 4.2. Unauthorized (401)

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Email hoặc mật khẩu không đúng",
  "timestamp": "2025-10-21T12:05:00.000Z",
  "path": "/api/auth/login"
}
```

### 4.3. Forbidden (403)

```json
{
  "success": false,
  "statusCode": 403,
  "message": "Bạn không có quyền truy cập. Yêu cầu vai trò: admin",
  "timestamp": "2025-10-21T12:10:00.000Z",
  "path": "/api/users"
}
```

### 4.4. Not Found (404)

```json
{
  "success": false,
  "statusCode": 404,
  "message": "User với ID \"550e8400-...\" không tồn tại",
  "timestamp": "2025-10-21T12:15:00.000Z",
  "path": "/api/users/550e8400-..."
}
```

### 4.5. Conflict (409)

```json
{
  "success": false,
  "statusCode": 409,
  "message": "Email này đã được sử dụng",
  "timestamp": "2025-10-21T12:20:00.000Z",
  "path": "/api/auth/register"
}
```

---

## 5. Postman Collection

Import collection này vào Postman để test nhanh:

```json
{
  "info": {
    "name": "P2A Core System",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"{{email}}\",\n  \"password\": \"{{password}}\",\n  \"role\": \"student\",\n  \"fullName\": \"Test User\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/register",
              "host": ["{{base_url}}"],
              "path": ["auth", "register"]
            }
          }
        }
      ]
    }
  ]
}
```

**Variables:**
- `base_url`: `http://localhost:3000/api`
- `email`: Your test email
- `password`: Your test password
- `access_token`: (Set automatically after login)

---

## 🎯 Testing Tips

1. **Dùng Swagger UI** (http://localhost:3000/api/docs) để test ngay trong browser
2. **Dùng Postman** để lưu collections và environments
3. **Dùng cURL** để test nhanh từ terminal
4. **Check logs** trong console để debug errors

---

**Happy Testing! 🚀**

