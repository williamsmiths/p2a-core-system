#!/bin/bash
# Script to setup slave as streaming replica
set -e

echo "=== Starting PostgreSQL Slave Replication Setup ==="

# Wait for master to be ready
echo "Waiting for master database to be ready..."
until pg_isready -h p2a-core-postgres-master -p 5432 -U p2a_user > /dev/null 2>&1; do
  echo "Master not ready yet, waiting..."
  sleep 2
done
echo "✓ Master database is ready"

# Remove existing data
echo "Removing existing data directory..."
rm -rf "$PGDATA"/*

# Create .pgpass file for passwordless authentication
echo "Creating .pgpass file..."
echo "p2a-core-postgres-master:5432:replication:replicator:Kx9mP2A2024Replicator7nQ8vR3s" > /var/lib/postgresql/.pgpass
chown postgres:postgres /var/lib/postgresql/.pgpass
chmod 600 /var/lib/postgresql/.pgpass

# Create base backup from master (without creating slot, use existing one)
echo "Creating base backup from master..."
su postgres -c "PGPASSFILE=/var/lib/postgresql/.pgpass pg_basebackup -h p2a-core-postgres-master -D $PGDATA -U replicator -v -P -R -X stream -S replica_slot"

# Set proper ownership and permissions
echo "Setting permissions..."
chown -R postgres:postgres "$PGDATA"
chmod 700 "$PGDATA"

echo "=== Slave Replication Setup Completed ==="
echo "Slave will start in standby mode and sync from master"

# Start PostgreSQL in standby mode as postgres user
exec gosu postgres postgres

