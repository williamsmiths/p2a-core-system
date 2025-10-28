#!/bin/bash
# Script to setup pg_hba.conf for master replication
set -e

echo "=== Setting up pg_hba.conf for replication ==="

# Copy custom pg_hba.conf to data directory
if [ -f /docker-entrypoint-initdb.d/pg_hba.conf.custom ]; then
    echo "Copying custom pg_hba.conf to data directory..."
    cp /docker-entrypoint-initdb.d/pg_hba.conf.custom /var/lib/postgresql/data/pg_hba.conf
    chown postgres:postgres /var/lib/postgresql/data/pg_hba.conf
    chmod 600 /var/lib/postgresql/data/pg_hba.conf
    echo "✓ pg_hba.conf configured successfully"
else
    echo "⚠ Custom pg_hba.conf not found, using default"
fi

echo "=== pg_hba.conf setup completed ==="

