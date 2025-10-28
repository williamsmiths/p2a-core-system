#!/bin/bash
# Script to setup slave as streaming replica
set -e

echo "=== Starting PostgreSQL Slave Replication Setup ==="

# Wait for master to be ready with better timing
echo "Waiting for master database to be ready..."
attempt=0
max_attempts=30
until pg_isready -h p2a-core-postgres-master -p 5432 -U p2a_user > /dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ $attempt -ge $max_attempts ]; then
    echo "❌ Master not ready after $max_attempts attempts. Exiting."
    exit 1
  fi
  echo "Master not ready yet (attempt $attempt/$max_attempts), waiting..."
  sleep 3
done
echo "✓ Master database is ready"

# Additional wait to ensure master is fully initialized
echo "Waiting for master to fully initialize replication slot..."
sleep 5

# Check if data directory is empty or already has data
if [ "$(ls -A $PGDATA 2>/dev/null)" ]; then
  echo "⚠ Data directory not empty. Checking if it's a valid PostgreSQL data directory..."
  if [ -f "$PGDATA/PG_VERSION" ]; then
    echo "✓ Found existing PostgreSQL data directory. Verifying master readiness before start..."
    # Even if data exists (already initialized), ensure master is reachable before starting
    verify_attempt=0
    verify_max_attempts=30
    until pg_isready -h p2a-core-postgres-master -p 5432 -U p2a_user > /dev/null 2>&1; do
      verify_attempt=$((verify_attempt + 1))
      if [ $verify_attempt -ge $verify_max_attempts ]; then
        echo "❌ Master still not ready after $verify_max_attempts attempts. Exiting."
        exit 1
      fi
      echo "Master not ready yet (verify $verify_attempt/$verify_max_attempts), waiting..."
      sleep 3
    done
    echo "✓ Master reachable. Starting slave in recovery/standby mode..."
    exec gosu postgres postgres
  else
    echo "⚠ Data directory contains non-PostgreSQL files. Cleaning up..."
    rm -rf "$PGDATA"/*
  fi
else
  echo "✓ Data directory is empty. Proceeding with replication setup..."
fi

# Create .pgpass file for passwordless authentication
echo "Creating .pgpass file..."
echo "p2a-core-postgres-master:5432:replication:replicator:Kx9mP2A2024Replicator7nQ8vR3s" > /var/lib/postgresql/.pgpass
chown postgres:postgres /var/lib/postgresql/.pgpass
chmod 600 /var/lib/postgresql/.pgpass

# Create base backup from master using existing replication slot
echo "Creating base backup from master with replication slot 'replica_slot'..."
su postgres -c "PGPASSFILE=/var/lib/postgresql/.pgpass pg_basebackup -h p2a-core-postgres-master -D $PGDATA -U replicator -v -P -R -X stream -S replica_slot" || {
  echo "❌ pg_basebackup failed. Trying without slot..."
  # Fallback: try without slot if slot doesn't exist
  su postgres -c "PGPASSFILE=/var/lib/postgresql/.pgpass pg_basebackup -h p2a-core-postgres-master -D $PGDATA -U replicator -v -P -R -X stream"
}

# Set proper ownership and permissions
echo "Setting permissions..."
chown -R postgres:postgres "$PGDATA"
chmod 700 "$PGDATA"

echo "=== Slave Replication Setup Completed ==="
echo "✓ Slave will start in standby mode and sync from master"
echo "✓ Streaming replication is active"

# Start PostgreSQL in standby mode as postgres user
exec gosu postgres postgres

