-- Setup replication user and configuration for PostgreSQL Master
-- This script runs after the main database is initialized

-- Create replication user
CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'Kx9mP2A2024Replicator7nQ8vR3s';

-- Grant necessary permissions
GRANT CONNECT ON DATABASE p2a_core TO replicator;
GRANT USAGE ON SCHEMA public TO replicator;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO replicator;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO replicator;

-- Alter default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO replicator;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO replicator;

-- Create replication slot (optional but recommended)
-- This will be created by the slave when it connects
-- SELECT pg_create_physical_replication_slot('slot_slave_1');

-- Show replication settings
SELECT name, setting FROM pg_settings WHERE name LIKE '%replication%' OR name LIKE '%wal%';

-- Log completion
\echo 'Master replication setup completed successfully'
GRANT CONNECT ON DATABASE p2a_core TO replicator;
GRANT USAGE ON SCHEMA public TO replicator;
