#!/bin/bash
# Setup pg_hba.conf for replication
set -e

# Wait for PostgreSQL to be ready
until pg_isready -h localhost -p 5432 -U postgres; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

# Copy custom pg_hba.conf
cp /tmp/pg_hba.conf /var/lib/postgresql/data/pg_hba.conf

# Set proper permissions
chown postgres:postgres /var/lib/postgresql/data/pg_hba.conf
chmod 600 /var/lib/postgresql/data/pg_hba.conf

# Reload PostgreSQL configuration
psql -U postgres -d p2a_core -c "SELECT pg_reload_conf();"

echo "pg_hba.conf configured for replication"
