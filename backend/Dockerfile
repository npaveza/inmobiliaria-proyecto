FROM php:8.1-fpm

# Instala dependencias necesarias
RUN apt-get update && apt-get install -y \
    libpq-dev zip unzip curl \
    && docker-php-ext-install pdo pdo_pgsql

# Instala Composer
RUN curl -sS https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer

WORKDIR /var/www/html
