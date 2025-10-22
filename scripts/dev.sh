#!/bin/bash

# Script để chạy development server
echo "🚀 Starting P2A Core System in development mode..."

# Load environment variables
if [ -f .env.development ]; then
  export $(cat .env.development | grep -v '^#' | xargs)
fi

# Start development server
npm run start:dev

