# 🚀 Hướng dẫn Setup P2A Core System

## Mục lục
- [Prerequisites](#prerequisites)
- [Setup Local Development](#setup-local-development)
- [Setup với Docker](#setup-với-docker)
- [Cấu hình Email (Gmail)](#cấu-hình-email-gmail)
- [Cấu hình PostgreSQL Master/Slave](#cấu-hình-postgresql-masterslave)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### 1. Cài đặt Node.js

```bash
# Kiểm tra version (cần >= 20.x)
node --version
npm --version

# Nếu chưa có, download từ:
# https://nodejs.org/
```

### 2. Cài đặt PostgreSQL

**Windows:**
- Download từ: https://www.postgresql.org/download/windows/
- Chạy installer và ghi nhớ password cho user `postgres`

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql-15 postgresql-contrib
sudo systemctl start postgresql
```

### 3. Cài đặt Docker (Optional)

- Download từ: https://www.docker.com/products/docker-desktop/

---

## Setup Local Development

### Bước 1: Clone Project

```bash
cd P2A-ASEAN/p2a-core-system
```

### Bước 2: Install Dependencies

```bash
npm install
```

### Bước 3: Tạo Database

```bash
# Login vào PostgreSQL
psql -U postgres

# Trong PostgreSQL console:
CREATE DATABASE p2a_core;
CREATE USER p2a_user WITH PASSWORD 'p2a_password';
GRANT ALL PRIVILEGES ON DATABASE p2a_core TO p2a_user;

# Thoát
\q
```

### Bước 4: Cấu hình Environment

Tạo file `.env` từ template:

```bash
cp env.example.txt .env
```

Chỉnh sửa `.env`:

```env
# Database
DB_MASTER_HOST=localhost
DB_MASTER_PORT=5432
DB_MASTER_USERNAME=p2a_user
DB_MASTER_PASSWORD=p2a_password
DB_MASTER_DATABASE=p2a_core

# TypeORM - Enable auto sync cho development
DB_SYNCHRONIZE=true
DB_LOGGING=true

# JWT Secrets (phải thay đổi trong production!)
JWT_SECRET=my-super-secret-jwt-key-dev-12345678
JWT_REFRESH_SECRET=my-refresh-secret-key-dev-12345678

# Email (xem phần Cấu hình Email bên dưới)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
MAIL_FROM=noreply@p2a-asean.org

EMAIL_VERIFICATION_URL=http://localhost:3000/api/auth/verify-email
```

### Bước 5: Chạy Application

```bash
# Development mode với hot-reload
npm run start:dev
```

Kiểm tra tại: http://localhost:3000/api/health

Expected response:
```json
{
  "status": "ok",
  "service": "p2a-core-system",
  "timestamp": "2025-10-21T...",
  "uptime": 123.456
}
```

### Bước 6: Kiểm tra Swagger API Docs

Mở browser: http://localhost:3000/api/docs

---

## Setup với Docker

### Bước 1: Tạo file `.env`

```bash
cp env.example.txt .env
# Chỉnh sửa các giá trị cần thiết (xem Bước 4 ở trên)
```

### Bước 2: Build và Run

```bash
# Build và start containers
docker-compose up -d

# Xem logs
docker-compose logs -f

# Hoặc dùng script
chmod +x scripts/docker-dev.sh
./scripts/docker-dev.sh
```

### Bước 3: Kiểm tra Services

```bash
# Check containers
docker-compose ps

# Expected output:
# p2a-core-system     running   0.0.0.0:3000->3000/tcp
# p2a-core-postgres   running   0.0.0.0:5432->5432/tcp
# p2a-core-pgadmin    running   0.0.0.0:5050->80/tcp
```

### Bước 4: Access Services

- **API**: http://localhost:3000/api/health
- **Swagger**: http://localhost:3000/api/docs
- **pgAdmin**: http://localhost:5050
  - Email: admin@p2a.local
  - Password: admin123

### Dừng Services

```bash
# Stop containers
docker-compose down

# Stop và xóa volumes (xóa database)
docker-compose down -v
```

---

## Cấu hình Email (Gmail)

### Bước 1: Bật 2-Step Verification

1. Đăng nhập Gmail
2. Vào https://myaccount.google.com/security
3. Tìm "2-Step Verification" và bật nó

### Bước 2: Tạo App Password

1. Vào https://myaccount.google.com/apppasswords
2. Chọn "Select app" → "Other (Custom name)"
3. Nhập tên: "P2A ASEAN"
4. Click "Generate"
5. Copy mã 16 ký tự (vd: `abcd efgh ijkl mnop`)

### Bước 3: Cập nhật `.env`

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=abcdefghijklmnop  # App password (không có space)
MAIL_FROM=noreply@p2a-asean.org
MAIL_FROM_NAME=P2A ASEAN Platform
```

### Bước 4: Test Email

Đăng ký tài khoản mới qua API và kiểm tra inbox:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "role": "student",
    "fullName": "Test User"
  }'
```

Kiểm tra email `test@example.com` để xem email xác thực.

---

## Cấu hình PostgreSQL Master/Slave

### Setup trong Local Development

TypeORM hỗ trợ tự động routing queries đến Master/Slave.

#### 1. Tạo Slave Database (Clone Master)

```bash
# Option 1: Tạo database thứ 2 trên cùng server
psql -U postgres
CREATE DATABASE p2a_core_slave;
GRANT ALL PRIVILEGES ON DATABASE p2a_core_slave TO p2a_user;
\q

# Copy data từ master sang slave
pg_dump -U p2a_user p2a_core | psql -U p2a_user p2a_core_slave
```

#### 2. Cập nhật `.env`

```env
# Database Master (Write)
DB_MASTER_HOST=localhost
DB_MASTER_PORT=5432
DB_MASTER_USERNAME=p2a_user
DB_MASTER_PASSWORD=p2a_password
DB_MASTER_DATABASE=p2a_core

# Database Slave (Read)
DB_SLAVE_HOST=localhost
DB_SLAVE_PORT=5432
DB_SLAVE_USERNAME=p2a_user
DB_SLAVE_PASSWORD=p2a_password
DB_SLAVE_DATABASE=p2a_core_slave
```

#### 3. Restart Application

```bash
npm run start:dev
```

TypeORM sẽ tự động:
- Gửi `INSERT`, `UPDATE`, `DELETE` → Master
- Gửi `SELECT` → Slave (round-robin nếu có nhiều slaves)

### Setup với Docker (Separate Containers)

Tạo `docker-compose.replication.yml`:

```yaml
version: '3.8'

services:
  postgres-master:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: p2a_user
      POSTGRES_PASSWORD: p2a_password
      POSTGRES_DB: p2a_core
    ports:
      - "5432:5432"
    volumes:
      - postgres_master_data:/var/lib/postgresql/data

  postgres-slave:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: p2a_user
      POSTGRES_PASSWORD: p2a_password
      POSTGRES_DB: p2a_core
    ports:
      - "5433:5432"
    volumes:
      - postgres_slave_data:/var/lib/postgresql/data

volumes:
  postgres_master_data:
  postgres_slave_data:
```

Cập nhật `.env`:

```env
DB_MASTER_HOST=localhost
DB_MASTER_PORT=5432

DB_SLAVE_HOST=localhost
DB_SLAVE_PORT=5433
```

---

## Troubleshooting

### 1. Database Connection Failed

**Error:** `ECONNREFUSED`

**Giải pháp:**
```bash
# Kiểm tra PostgreSQL đang chạy
# Windows:
services.msc  # Tìm "postgresql"

# macOS/Linux:
sudo systemctl status postgresql

# Docker:
docker-compose ps postgres
```

### 2. Port 3000 Already in Use

**Error:** `EADDRINUSE`

**Giải pháp:**
```bash
# Tìm process đang dùng port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Hoặc đổi port trong .env:
PORT=3001
```

### 3. Email Not Sending

**Giải pháp:**
1. Kiểm tra App Password đã tạo đúng chưa
2. Kiểm tra firewall không block port 587
3. Xem logs:
```bash
docker-compose logs app | grep -i email
```

### 4. TypeORM Synchronize Issues

**Error:** Tables not created

**Giải pháp:**
```bash
# Đảm bảo DB_SYNCHRONIZE=true trong .env
DB_SYNCHRONIZE=true

# Xóa và tạo lại database
psql -U postgres
DROP DATABASE p2a_core;
CREATE DATABASE p2a_core;
GRANT ALL PRIVILEGES ON DATABASE p2a_core TO p2a_user;
\q

# Restart app
npm run start:dev
```

### 5. JWT Token Invalid

**Error:** `UnauthorizedException`

**Giải pháp:**
- Kiểm tra JWT_SECRET trong `.env` đã set đúng chưa
- Token có thể hết hạn, login lại
- Đảm bảo gửi token trong header: `Authorization: Bearer <token>`

### 6. CORS Errors

**Error:** `CORS policy`

**Giải pháp:**
```env
# Thêm frontend URL vào CORS_ORIGIN
CORS_ORIGIN=http://localhost:3001,http://localhost:4200
```

---

## 🎉 Setup Hoàn tất!

Bây giờ bạn có thể:

1. ✅ Đăng ký user mới
2. ✅ Xác thực email
3. ✅ Đăng nhập và nhận JWT token
4. ✅ Gọi protected APIs
5. ✅ Quản lý profile

Xem thêm ví dụ API trong file `API-EXAMPLES.md`

**Need help?** Liên hệ P2A ASEAN Team 🎓

