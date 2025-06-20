#!/bin/bash

# Install PHP dependencies
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Install Node.js dependencies
npm ci
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set up storage symlink
php artisan storage:link

echo "Build completed successfully!"