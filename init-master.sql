-- Master Database Configuration
-- Tạo user cho replication
CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'replicator_password';

-- Cấu hình WAL (Write-Ahead Logging) cho replication
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET max_wal_senders = 3;
ALTER SYSTEM SET max_replication_slots = 3;
ALTER SYSTEM SET hot_standby = on;

-- Tạo replication slot
SELECT pg_create_physical_replication_slot('replica_slot');

-- Restart để áp dụng cấu hình
SELECT pg_reload_conf();
