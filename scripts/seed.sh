#!/bin/bash

# Configuration
CONTAINER_NAME="stakegood_db"
DB_USER="stakegood"
DB_NAME="stakegood_dev"
SQL_FILE="./scripts/seed-db.sql"

echo "🚀 Populating database in container: $CONTAINER_NAME..."

# Check if container is running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    # Copy SQL file to container
    docker cp $SQL_FILE $CONTAINER_NAME:/tmp/seed-db.sql
    
    # Execute SQL
    docker exec -it $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -f /tmp/seed-db.sql
    
    echo "✅ Database populated successfully!"
    echo "🔑 Admin wallet: GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4"
else
    echo "❌ Error: Container $CONTAINER_NAME is not running."
    exit 1
fi
