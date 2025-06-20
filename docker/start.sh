#!/bin/bash

# Run Laravel migrations
php artisan migrate --force

# Start Apache
apache2-foreground