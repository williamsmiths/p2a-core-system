# Admin Users Setup - Hoàn thành ✅

## Tổng quan

Đã tạo thành công 2 tài khoản admin mặc định cho hệ thống P2A ASEAN:

### 🔑 **Super Admin**
- **Email**: `superadmin@p2a-asean.org`
- **Password**: `SuperAdmin@2025!`
- **Role**: `SUPER_ADMIN`
- **Quyền**: Toàn quyền quản lý hệ thống

### 🔑 **Admin**
- **Email**: `admin@p2a-asean.org`
- **Password**: `Admin@2025!`
- **Role**: `ADMIN`
- **Quyền**: Quản lý nội dung và người dùng

## Cách sử dụng

### 1. Đăng nhập qua API

```bash
# Login Super Admin
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@p2a-asean.org",
    "password": "SuperAdmin@2025!"
  }'

# Login Admin
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@p2a-asean.org", 
    "password": "Admin@2025!"
  }'
```

### 2. Kiểm tra trong Database

```sql
-- Xem thông tin admin users
SELECT 
    u.email,
    u.role,
    u.is_active,
    u.is_email_verified,
    up.full_name,
    u.created_at
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.role IN ('super_admin', 'admin')
ORDER BY u.role;
```

## Bảo mật

⚠️ **QUAN TRỌNG**:
- Đổi mật khẩu ngay sau khi đăng nhập lần đầu
- Không sử dụng mật khẩu mặc định trong production
- Chỉ sử dụng trong môi trường development

## Files liên quan

- `scripts/create-admin-users.sql` - Script SQL tạo admin users
- `scripts/generate-password-hash.js` - Script tạo password hash
- `src/scripts/init-admin-users.ts` - Script TypeScript (có lỗi database connection)

## Troubleshooting

### Lỗi "User not found"
- Kiểm tra database connection
- Đảm bảo script SQL đã chạy thành công
- Kiểm tra email có đúng không

### Lỗi "Invalid password"
- Đảm bảo password chính xác (case-sensitive)
- Kiểm tra password hash trong database

### Lỗi database connection
- Đảm bảo PostgreSQL container đang chạy
- Kiểm tra cấu hình trong `.env`
- Test connection: `docker exec p2a-core-postgres-master psql -U p2a_user -d p2a_core -c "SELECT 1;"`

## Xóa Admin Users (nếu cần)

```sql
-- Xóa Super Admin
DELETE FROM user_profiles WHERE user_id = (SELECT id FROM users WHERE email = 'superadmin@p2a-asean.org');
DELETE FROM users WHERE email = 'superadmin@p2a-asean.org';

-- Xóa Admin  
DELETE FROM user_profiles WHERE user_id = (SELECT id FROM users WHERE email = 'admin@p2a-asean.org');
DELETE FROM users WHERE email = 'admin@p2a-asean.org';
```

## Tạo Admin Users mới

Nếu cần tạo admin users mới, sử dụng script:

```bash
# 1. Tạo password hash
node scripts/generate-password-hash.js

# 2. Cập nhật file SQL với hash mới
# 3. Chạy script
docker exec p2a-core-postgres-master psql -U p2a_user -d p2a_core -f /tmp/create-admin-users.sql
```

## Kết quả

✅ **Đã hoàn thành**:
- Tạo Super Admin user với đầy đủ profile
- Tạo Admin user với đầy đủ profile  
- Cấu hình roles và permissions
- Sẵn sàng để đăng nhập và sử dụng

🎉 **Hệ thống P2A ASEAN đã sẵn sàng với admin users!**
