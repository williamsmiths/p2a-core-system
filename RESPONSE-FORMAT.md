# 📋 Response Format

## ✅ Success Response Format

**Cấu trúc chuẩn cho tất cả success response:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": { ... },
  "timestamp": "2025-10-21T10:30:00.000Z"
}
```

### Ví dụ cụ thể:

**1. Đăng ký thành công (201):**
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

**2. Đăng nhập thành công (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "student@example.com",
      "role": "student",
      "isActive": true,
      "isEmailVerified": true
    }
  },
  "timestamp": "2025-10-21T10:30:00.000Z"
}
```

**3. Lấy profile thành công (200):**
```json
{
  "success": true,
  "statusCode": 200,
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

**4. Cập nhật profile thành công (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "profile": {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "fullName": "Nguyen Van A Updated",
      "phoneNumber": "+84 901234567",
      "country": "Vietnam",
      "city": "Ho Chi Minh",
      "bio": "Sinh viên năm 3 ngành Công nghệ Thông tin - Updated",
      "dateOfBirth": "2002-05-15",
      "gender": "male",
      "linkedinUrl": "https://linkedin.com/in/nguyen-van-a",
      "websiteUrl": "https://nguyenvana.dev",
      "avatarUrl": "https://example.com/avatars/user123.jpg",
      "updatedAt": "2025-10-21T11:20:00.000Z"
    }
  },
  "timestamp": "2025-10-21T11:20:00.000Z"
}
```

**5. Xác thực email thành công (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "timestamp": "2025-10-21T10:35:00.000Z"
}
```

**6. Đổi mật khẩu thành công (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "timestamp": "2025-10-21T11:20:00.000Z"
}
```

**7. Logout thành công (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "timestamp": "2025-10-21T11:25:00.000Z"
}
```

## ❌ Error Response Format

**Cấu trúc chuẩn cho tất cả error response:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message here",
  "timestamp": "2025-10-21T10:30:00.000Z"
}
```

### Ví dụ cụ thể:

**1. Validation Error (400):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Email không hợp lệ",
  "timestamp": "2025-10-21T10:30:00.000Z"
}
```

**2. Email đã tồn tại (409):**
```json
{
  "success": false,
  "statusCode": 409,
  "message": "Email đã được sử dụng",
  "timestamp": "2025-10-21T10:30:00.000Z"
}
```

**3. Unauthorized (401):**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Token không hợp lệ",
  "timestamp": "2025-10-21T10:30:00.000Z"
}
```

**4. Forbidden (403):**
```json
{
  "success": false,
  "statusCode": 403,
  "message": "Không có quyền truy cập",
  "timestamp": "2025-10-21T10:30:00.000Z"
}
```

**5. Not Found (404):**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Không tìm thấy tài nguyên",
  "timestamp": "2025-10-21T10:30:00.000Z"
}
```

## 🔧 Implementation

Format response được implement thông qua:

1. **TransformInterceptor** (`src/common/interceptors/transform.interceptor.ts`)
   - Tự động wrap tất cả response thành format chuẩn
   - Không có message cho success response
   - Chỉ có message cho error response

2. **ApiResponse Interface** (`src/common/interceptors/transform.interceptor.ts`)
   ```typescript
   export interface ApiResponse<T> {
     success: boolean;
     statusCode: number;
     data: T;
     timestamp: string;
   }
   ```

3. **Global Exception Filter** (`src/common/filters/http-exception.filter.ts`)
   - Xử lý tất cả error và format thành chuẩn
   - Tự động translate error message theo ngôn ngữ

## 📝 Lưu ý

- **Success response**: Không có field `message`
- **Error response**: Có field `message` với nội dung lỗi
- **Timestamp**: Luôn là UTC timezone
- **Data**: Có thể là object, array, hoặc null
- **Status Code**: HTTP status code chuẩn
