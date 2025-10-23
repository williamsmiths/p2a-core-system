# Admin Users Setup

## Tổng quan

Script này sẽ tạo 2 tài khoản admin mặc định cho hệ thống P2A ASEAN:

- **Super Admin**: Quyền tối cao, quản lý toàn bộ hệ thống
- **Admin**: Quyền quản lý nội dung và người dùng

## Cách chạy

### 1. Đảm bảo database đã sẵn sàng

```bash
# Khởi động database (nếu chưa chạy)
docker-compose -f docker-compose-db.yml up -d

# Kiểm tra kết nối database
npm run start:dev
```

### 2. Chạy script khởi tạo Admin

```bash
# Chạy script tạo admin users
npm run script:init-admin
```

### 3. Kiểm tra kết quả

Script sẽ tạo 2 tài khoản admin với thông tin sau:

#### Super Admin
- **Email**: `superadmin@p2a-asean.org`
- **Password**: `SuperAdmin@2025!`
- **Role**: `SUPER_ADMIN`
- **Quyền**: Toàn quyền quản lý hệ thống

#### Admin
- **Email**: `admin@p2a-asean.org`
- **Password**: `Admin@2025!`
- **Role**: `ADMIN`
- **Quyền**: Quản lý nội dung và người dùng

## Lưu ý bảo mật

⚠️ **QUAN TRỌNG**: 
- Đổi mật khẩu ngay sau khi đăng nhập lần đầu
- Không sử dụng mật khẩu mặc định trong production
- Chỉ chạy script này trong môi trường development hoặc lần đầu setup

## Troubleshooting

### Lỗi "Email already exists"
- Script sẽ bỏ qua nếu admin đã tồn tại
- Không tạo duplicate accounts

### Lỗi database connection
- Kiểm tra database đã chạy chưa
- Kiểm tra cấu hình trong `.env`
- Đảm bảo TypeORM đã sync schema

### Lỗi "Role not found"
- Đảm bảo đã build lại project sau khi thêm role mới
- Kiểm tra enum UserRole đã có SUPER_ADMIN

## Cấu trúc dữ liệu

Script sẽ tạo:

1. **User records** trong bảng `users`:
   - Thông tin xác thực (email, password hash)
   - Role và trạng thái
   - Email đã được verify

2. **UserProfile records** trong bảng `user_profiles`:
   - Thông tin cá nhân
   - Liên kết social media
   - Cấu hình preferences

## Xóa Admin Users (nếu cần)

```sql
-- Xóa Super Admin
DELETE FROM user_profiles WHERE user_id = (SELECT id FROM users WHERE email = 'superadmin@p2a-asean.org');
DELETE FROM users WHERE email = 'superadmin@p2a-asean.org';

-- Xóa Admin
DELETE FROM user_profiles WHERE user_id = (SELECT id FROM users WHERE email = 'admin@p2a-asean.org');
DELETE FROM users WHERE email = 'admin@p2a-asean.org';
```

## API Testing

Sau khi tạo admin users, có thể test API:

```bash
# Login Super Admin
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "superadmin@p2a-asean.org", "password": "SuperAdmin@2025!"}'

# Login Admin
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@p2a-asean.org", "password": "Admin@2025!"}'
```
