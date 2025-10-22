# 🌍 I18n (Internationalization) Guide

## Tổng quan

P2A Core System hỗ trợ đa ngôn ngữ với **nestjs-i18n** để phục vụ cộng đồng ASEAN:

- 🇻🇳 **Vietnamese (vi)** - Tiếng Việt
- 🇺🇸 **English (en)** - English  
- 🇹🇭 **Thai (th)** - ไทย
- 🇮🇩 **Indonesian (id)** - Bahasa Indonesia
- 🇲🇾 **Malay (ms)** - Bahasa Melayu

## Cách sử dụng

### 1. Trong Service

```typescript
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(private readonly i18n: I18nService) {}

  async register() {
    // Translate message
    const message = this.i18n.translate('auth.register_success');
    
    // Translate với arguments
    const messageWithArgs = this.i18n.translate('auth.welcome', {
      name: 'John Doe'
    });

    // Translate với ngôn ngữ cụ thể
    const messageInThai = this.i18n.translate('auth.register_success', {}, 'th');
  }
}
```

### 2. Trong Controller

```typescript
import { I18n, CurrentLanguage } from '../../common/i18n';

@Controller('auth')
export class AuthController {
  
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @I18n() i18n: I18nService,
    @CurrentLanguage() lang: string
  ) {
    // Sử dụng i18n service
    const message = i18n.translate('auth.register_success');
    
    return {
      message,
      language: lang
    };
  }
}
```

### 3. Trong Exception

```typescript
// Custom Exception với i18n
export class BusinessException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    private i18n?: I18nService
  ) {
    super(
      {
        success: false,
        statusCode,
        message: i18n ? i18n.translate(message) : message,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}

// Sử dụng
throw new BusinessException('auth.email_already_exists', HttpStatus.CONFLICT, this.i18n);
```

## Translation Keys

### Cấu trúc keys

```
{
  "success": {
    "created": "Tạo thành công",
    "updated": "Cập nhật thành công", 
    "deleted": "Xóa thành công"
  },
  "error": {
    "not_found": "Không tìm thấy tài nguyên",
    "unauthorized": "Không có quyền truy cập"
  },
  "auth": {
    "register_success": "Đăng ký thành công",
    "login_success": "Đăng nhập thành công"
  },
  "validation": {
    "required": "Trường này không được để trống",
    "email_invalid": "Email không hợp lệ"
  }
}
```

### Các keys chính

#### Success Messages
- `success.created` - Tạo thành công
- `success.updated` - Cập nhật thành công
- `success.deleted` - Xóa thành công
- `success.sent` - Gửi thành công
- `success.verified` - Xác thực thành công

#### Error Messages
- `error.not_found` - Không tìm thấy tài nguyên
- `error.unauthorized` - Không có quyền truy cập
- `error.forbidden` - Truy cập bị từ chối
- `error.conflict` - Tài nguyên đã tồn tại
- `error.validation_failed` - Dữ liệu không hợp lệ

#### Auth Messages
- `auth.register_success` - Đăng ký thành công
- `auth.login_success` - Đăng nhập thành công
- `auth.logout_success` - Đăng xuất thành công
- `auth.email_verified` - Xác thực email thành công
- `auth.email_already_exists` - Email đã được sử dụng
- `auth.invalid_credentials` - Thông tin đăng nhập không đúng

#### Validation Messages
- `validation.required` - Trường này không được để trống
- `validation.email_invalid` - Email không hợp lệ
- `validation.password_weak` - Mật khẩu yếu
- `validation.role_invalid` - Vai trò không hợp lệ

## Language Detection

### 1. Query Parameter
```
GET /api/users/me?lang=vi
GET /api/users/me?lang=en
GET /api/users/me?lang=th
```

### 2. Accept-Language Header
```http
GET /api/users/me
Accept-Language: vi-VN,vi;q=0.9,en;q=0.8
```

### 3. Default Language
Nếu không có language được chỉ định, hệ thống sẽ dùng **English (en)** làm mặc định.

## Thêm ngôn ngữ mới

### Bước 1: Tạo file translation

```bash
# Tạo thư mục cho ngôn ngữ mới
mkdir -p src/common/i18n/i18n/ja

# Tạo file common.json
touch src/common/i18n/i18n/ja/common.json
```

### Bước 2: Thêm nội dung translation

```json
// src/common/i18n/i18n/ja/common.json
{
  "success": {
    "created": "作成に成功しました",
    "updated": "更新に成功しました",
    "deleted": "削除に成功しました"
  },
  "auth": {
    "register_success": "登録が成功しました",
    "login_success": "ログインに成功しました"
  }
}
```

### Bước 3: Cập nhật supported languages

```typescript
// src/common/i18n/i18n.service.ts
getSupportedLanguages(): string[] {
  return ['en', 'vi', 'th', 'id', 'ms', 'ja']; // Thêm 'ja'
}
```

## API Examples với i18n

### 1. Register với Vietnamese

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept-Language: vi" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "role": "student",
    "fullName": "Test User"
  }'
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
  "data": { ... }
}
```

### 2. Register với Thai

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept-Language: th" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "role": "student",
    "fullName": "Test User"
  }'
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "ลงทะเบียนสำเร็จ กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี",
  "data": { ... }
}
```

### 3. Register với English (default)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "role": "student",
    "fullName": "Test User"
  }'
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": { ... }
}
```

## Best Practices

### 1. Sử dụng keys có ý nghĩa

```typescript
// ✅ Good
this.i18n.translate('auth.register_success')

// ❌ Bad  
this.i18n.translate('msg1')
```

### 2. Nhóm keys theo module

```json
{
  "auth": { ... },
  "user": { ... },
  "email": { ... },
  "validation": { ... }
}
```

### 3. Sử dụng arguments cho dynamic content

```typescript
// Translation file
{
  "auth": {
    "welcome": "Chào mừng {{name}} đến với P2A ASEAN!"
  }
}

// Usage
this.i18n.translate('auth.welcome', { name: 'John Doe' })
// Output: "Chào mừng John Doe đến với P2A ASEAN!"
```

### 4. Fallback language

```typescript
// Luôn có fallback về English
const message = this.i18n.translate('auth.register_success', {}, 'en');
```

## Testing i18n

### 1. Unit Test

```typescript
describe('AuthService', () => {
  it('should return Vietnamese message', async () => {
    const result = await authService.register(dto);
    expect(result.message).toBe('Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.');
  });
});
```

### 2. Integration Test

```typescript
it('should return Thai message with Accept-Language header', async () => {
  const response = await request(app.getHttpServer())
    .post('/api/auth/register')
    .set('Accept-Language', 'th')
    .send(registerDto);
    
  expect(response.body.message).toContain('ลงทะเบียนสำเร็จ');
});
```

## Troubleshooting

### 1. Translation không hiển thị

**Nguyên nhân:** Key không tồn tại trong translation file
**Giải pháp:** Kiểm tra key có đúng không, thêm key vào tất cả language files

### 2. Language không được detect

**Nguyên nhân:** Accept-Language header không đúng format
**Giải pháp:** Sử dụng format chuẩn: `vi-VN,vi;q=0.9,en;q=0.8`

### 3. Arguments không được thay thế

**Nguyên nhân:** Syntax trong translation file không đúng
**Giải pháp:** Sử dụng `{{variable}}` thay vì `${variable}`

---

**Happy Internationalization! 🌍**

