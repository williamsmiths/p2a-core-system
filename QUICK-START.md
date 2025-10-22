# ⚡ Quick Start - P2A Core System

Hướng dẫn cài đặt và chạy nhanh trong 5 phút!

## Option 1: Docker (Recommended) 🐳

### Bước 1: Chuẩn bị

```bash
# Đảm bảo Docker đã cài đặt
docker --version
docker-compose --version
```

### Bước 2: Clone và Configure

```bash
cd p2a-core-system
cp env.example.txt .env
```

**Chỉnh sửa `.env`** (chỉ cần các field này):

```env
# JWT Secrets
JWT_SECRET=my-super-secret-key-12345678
JWT_REFRESH_SECRET=my-refresh-secret-key-12345678

# Email (Gmail - optional, có thể skip nếu không test email)
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
```

### Bước 3: Start Services

```bash
docker-compose up -d
```

### Bước 4: Verify

```bash
# Check services
docker-compose ps

# Test API
curl http://localhost:3000/api/health
```

**✅ Done!** API đang chạy tại `http://localhost:3000/api`

---

## Option 2: Local Development 💻

### Bước 1: Prerequisites

```bash
# Cài Node.js 20+
node --version  # Should be >= 20.x

# Cài PostgreSQL 15+
# Download: https://www.postgresql.org/download/
```

### Bước 2: Setup Database

```bash
# Login vào PostgreSQL
psql -U postgres

# Tạo database và user
CREATE DATABASE p2a_core;
CREATE USER p2a_user WITH PASSWORD 'p2a_password';
GRANT ALL PRIVILEGES ON DATABASE p2a_core TO p2a_user;
\q
```

### Bước 3: Install Dependencies

```bash
cd p2a-core-system
npm install
```

### Bước 4: Configure Environment

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
DB_SYNCHRONIZE=true

# JWT
JWT_SECRET=my-super-secret-key-12345678
JWT_REFRESH_SECRET=my-refresh-secret-key-12345678

# Email (optional)
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
```

### Bước 5: Start Development Server

```bash
npm run start:dev
```

**✅ Done!** API đang chạy tại `http://localhost:3000/api`

---

## 🧪 Test API

### 1. Health Check

```bash
curl http://localhost:3000/api/health
```

Expected:
```json
{
  "status": "ok",
  "service": "p2a-core-system"
}
```

### 2. Register User

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

### 3. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

Copy `accessToken` từ response.

### 4. Get Profile

```bash
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📚 Next Steps

1. **Swagger UI**: http://localhost:3000/api/docs
2. **pgAdmin** (if using Docker): http://localhost:5050
3. **Read Full Documentation**: [README.md](README.md)
4. **Setup Guide**: [SETUP.md](SETUP.md)
5. **API Examples**: [API-EXAMPLES.md](API-EXAMPLES.md)

---

## 🔧 Common Commands

```bash
# Development
npm run start:dev       # Start với hot-reload
npm run build          # Build production
npm run start:prod     # Start production

# Docker
docker-compose up -d               # Start services
docker-compose down               # Stop services
docker-compose logs -f app        # View logs
docker-compose restart app        # Restart app

# Database
docker-compose exec postgres psql -U p2a_user -d p2a_core

# Code Quality
npm run lint           # Run ESLint
npm run format         # Run Prettier
npm run test           # Run tests
```

---

## 🐛 Troubleshooting

### Port 3000 đã được sử dụng

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Hoặc đổi port trong .env
PORT=3001
```

### Database connection error

```bash
# Check PostgreSQL service
# Windows: services.msc
# Linux: sudo systemctl status postgresql
# Docker: docker-compose ps postgres

# Reset database
docker-compose down -v
docker-compose up -d
```

### Email không gửi được

- Kiểm tra Gmail App Password đã tạo đúng chưa
- Đảm bảo không có space trong MAIL_PASSWORD
- Test với email khác

---

## 🎯 Production Deployment

**⚠️ Important**: Trước khi deploy production:

1. ✅ Đổi tất cả secrets trong `.env`
2. ✅ Set `DB_SYNCHRONIZE=false`
3. ✅ Enable SSL/HTTPS
4. ✅ Setup PostgreSQL Master/Slave
5. ✅ Configure backup strategy
6. ✅ Setup monitoring (Prometheus/Grafana)
7. ✅ Enable rate limiting
8. ✅ Review CORS origins

---

**Need Help?** 📧 Contact P2A ASEAN Team

**Happy Coding! 🚀**

