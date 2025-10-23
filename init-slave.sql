-- Slave Database Configuration
-- Cấu hình để nhận replication từ master
ALTER SYSTEM SET hot_standby = on;
ALTER SYSTEM SET max_standby_streaming_delay = 30s;
ALTER SYSTEM SET max_standby_archive_delay = 30s;

-- Restart để áp dụng cấu hình
SELECT pg_reload_conf();
