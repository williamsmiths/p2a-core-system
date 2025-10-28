# Hướng Dẫn Master-Slave Replication PostgreSQL

## Các Lỗi Đã Sửa

### 1. **Lỗi Mount pg_hba.conf**
- **Vấn đề cũ**: Mount trực tiếp vào `/var/lib/postgresql/data/pg_hba.conf` gây conflict khi khởi tạo
- **Giải pháp**: Tạo script `01-setup-pg-hba.sh` để copy file sau khi PostgreSQL khởi tạo xong

### 2. **Lỗi Replication Slot**
- **Vấn đề cũ**: Slave yêu cầu slot `replica_slot` nhưng master không tạo
- **Giải pháp**: Bật tạo slot trong `02-setup-replication.sql` và thêm fallback trong script slave

### 3. **Lỗi Command Slave**
- **Vấn đề cũ**: Dùng `command` thay vì `entrypoint` khiến container không start đúng
- **Giải pháp**: Đổi sang `entrypoint` và thêm `start_period` cho healthcheck

### 4. **Lỗi Named Volume**
- **Vấn đề cũ**: Mount `./postgres_master_data` gây vấn đề permission trên Windows
- **Giải pháp**: Dùng named volumes `postgres_master_data` và `postgres_slave_data`

## Cách Khởi Động Lần Đầu (Chưa Có Data)

### Bước 1: Dọn dẹp nếu có data cũ
```bash
cd p2a-core-system

# Dừng containers nếu đang chạy
docker-compose -f docker-compose-db.yml down

# Xóa volumes cũ (nếu có)
docker volume rm postgres_master_data postgres_slave_data 2>/dev/null || true
```

### Bước 2: Khởi động Master-Slave
```bash
# Khởi động cả master và slave
docker-compose -f docker-compose-db.yml up -d

# Xem logs để kiểm tra
docker-compose -f docker-compose-db.yml logs -f
```

### Bước 3: Kiểm tra trạng thái
```bash
# Kiểm tra master
docker exec -it p2a-core-postgres-master psql -U p2a_user -d p2a_core -c "SELECT * FROM pg_stat_replication;"

# Kiểm tra slave
docker exec -it p2a-core-postgres-slave psql -U p2a_user -d p2a_core -c "SELECT pg_is_in_recovery();"
```

## Kết Quả Mong Đợi

### Master (Port 5432)
- Chạy ở chế độ read-write
- Tạo replication slot `replica_slot`
- Phát streaming replication đến slave

### Slave (Port 5433)
- Chạy ở chế độ read-only (hot standby)
- Nhận data từ master qua streaming replication
- Tự động sync real-time

## Cấu Trúc Files

```
p2a-core-system/
├── docker-compose-db.yml          # Cấu hình master-slave
├── scripts/
│   ├── 01-setup-pg-hba.sh        # Setup pg_hba.conf cho master
│   ├── 02-setup-replication.sql  # Tạo user và slot cho replication
│   ├── pg_hba.conf               # Cấu hình authentication
│   └── setup-slave-replication.sh # Setup slave từ master backup
```

## Troubleshooting

### Slave không kết nối được Master
```bash
# Kiểm tra logs của slave
docker logs p2a-core-postgres-slave

# Kiểm tra network connectivity
docker exec p2a-core-postgres-slave pg_isready -h p2a-core-postgres-master -p 5432 -U p2a_user
```

### Replication không hoạt động
```bash
# Kiểm tra replication slot trên master
docker exec -it p2a-core-postgres-master psql -U p2a_user -d p2a_core -c "SELECT * FROM pg_replication_slots;"

# Kiểm tra replication status
docker exec -it p2a-core-postgres-master psql -U p2a_user -d p2a_core -c "SELECT * FROM pg_stat_replication;"
```

### Reset toàn bộ
```bash
# Dừng và xóa tất cả
docker-compose -f docker-compose-db.yml down -v

# Khởi động lại
docker-compose -f docker-compose-db.yml up -d
```

## Lưu Ý Quan Trọng

1. **Master chạy trước Slave**: Slave depends_on master với condition healthy
2. **Slave là Read-Only**: Không thể write vào slave, chỉ đọc
3. **Replication Slot**: Đã được tạo tự động với tên `replica_slot`
4. **Streaming Replication**: Data sync real-time từ master sang slave
5. **Named Volumes**: Data được lưu trong Docker named volumes, an toàn hơn bind mounts

## Các Command Hữu Ích

```bash
# Xem logs real-time
docker-compose -f docker-compose-db.yml logs -f

# Restart services
docker-compose -f docker-compose-db.yml restart

# Stop services
docker-compose -f docker-compose-db.yml down

# Kiểm tra replication lag
docker exec -it p2a-core-postgres-master psql -U p2a_user -d p2a_core -c "SELECT client_addr, state, sent_lsn, write_lsn, flush_lsn, replay_lsn FROM pg_stat_replication;"
```

