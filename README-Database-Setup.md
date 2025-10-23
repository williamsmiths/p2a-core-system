# Database Master/Slave Setup

## Tổng quan

Dự án sử dụng PostgreSQL với cấu hình Master/Slave replication:
- **Master Database**: Xử lý tất cả thao tác WRITE (INSERT, UPDATE, DELETE) - Port 5432
- **Slave Database**: Xử lý tất cả thao tác READ (SELECT) - Port 5433

## Cách chạy

### 1. Khởi động databases
```bash
# Chạy cả master và slave
docker-compose -f docker-compose-db.yml up -d

# Hoặc chỉ chạy master (nếu chưa cần slave)
docker-compose -f docker-compose-db.yml up -d postgres-master
```

### 2. Kiểm tra trạng thái
```bash
# Kiểm tra containers
docker ps

# Kiểm tra logs
docker logs p2a-core-postgres-master
docker logs p2a-core-postgres-slave
```

### 3. Kết nối database
```bash
# Kết nối Master (Write)
psql -h localhost -p 5432 -U p2a_user -d p2a_core

# Kết nối Slave (Read)
psql -h localhost -p 5433 -U p2a_user -d p2a_core
```

## Cấu hình Environment

Tạo file `.env` từ `env.example.txt` và cấu hình:

```env
# Master Database (Write)
DB_MASTER_HOST=localhost
DB_MASTER_PORT=5432
DB_MASTER_USERNAME=p2a_user
DB_MASTER_PASSWORD=p2a_password
DB_MASTER_DATABASE=p2a_core

# Slave Database (Read)
DB_SLAVE_HOST=localhost
DB_SLAVE_PORT=5433
DB_SLAVE_USERNAME=p2a_user
DB_SLAVE_PASSWORD=p2a_password
DB_SLAVE_DATABASE=p2a_core
```

## Replication

- Master tự động replicate data đến Slave
- Slave chỉ nhận được data, không thể write
- Nếu Master down, Slave vẫn hoạt động cho READ operations
- Để có write operations, cần promote Slave thành Master

## Troubleshooting

### 1. Slave không sync với Master
```bash
# Kiểm tra replication status trên Master
docker exec p2a-core-postgres-master psql -U p2a_user -d p2a_core -c "SELECT * FROM pg_stat_replication;"
```

### 2. Reset replication
```bash
# Dừng containers
docker-compose -f docker-compose-db.yml down

# Xóa volumes (CẢNH BÁO: Mất hết data)
docker volume rm p2a-core-system_postgres_master_data
docker volume rm p2a-core-system_postgres_slave_data

# Chạy lại
docker-compose -f docker-compose-db.yml up -d
```

### 3. Backup và Restore
```bash
# Backup Master
docker exec p2a-core-postgres-master pg_dump -U p2a_user p2a_core > backup.sql

# Restore vào Master
docker exec -i p2a-core-postgres-master psql -U p2a_user p2a_core < backup.sql
```

## Monitoring

### Kiểm tra replication lag
```sql
-- Trên Master
SELECT client_addr, state, sent_lsn, write_lsn, flush_lsn, replay_lsn, 
       pg_wal_lsn_diff(sent_lsn, replay_lsn) AS lag_bytes
FROM pg_stat_replication;
```

### Kiểm tra Slave status
```sql
-- Trên Slave
SELECT pg_is_in_recovery();
-- Trả về 't' nếu đang trong recovery mode (slave)
-- Trả về 'f' nếu đang là master
```
