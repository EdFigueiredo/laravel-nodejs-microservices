#!/bin/sh
set -e

# Função para log
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ENTRYPOINT: $1"
}

log "Iniciando Laravel App..."

# Verificar se é um projeto Laravel válido
if [ ! -f artisan ]; then
    log "Projeto Laravel não encontrado. Criando..."
    # Limpar diretório atual (exceto arquivos Docker)
    find . -mindepth 1 -maxdepth 1 ! -name 'Dockerfile' ! -name 'docker-entrypoint.sh' ! -name '.env.docker' -exec rm -rf {} +
    # Criar projeto Laravel
    composer create-project laravel/laravel . --no-interaction
    log "Projeto Laravel criado com sucesso!"
fi

# Configurar .env
if [ ! -f .env ]; then
    if [ -f .env.docker ]; then
        log "Copiando .env.docker para .env..."
        cp .env.docker .env
    elif [ -f .env.example ]; then
        log "Copiando .env.example para .env..."
        cp .env.example .env
    else
        log "Criando .env básico..."
        cat > .env << EOF
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel_db
DB_USERNAME=laravel_user
DB_PASSWORD=laravel_password

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120
EOF
    fi
fi

# Gerar APP_KEY se não existir
if ! grep -q "^APP_KEY=.*[^[:space:]]" .env; then
    log "Gerando APP_KEY..."
    php artisan key:generate --force --no-interaction
fi

# Aguardar MySQL se configurado
if [ "$DB_CONNECTION" = "mysql" ] && [ -n "$DB_HOST" ]; then
    log "Aguardando MySQL em $DB_HOST:$DB_PORT..."
    counter=0
    while ! nc -z $DB_HOST $DB_PORT; do
        sleep 1
        counter=$((counter + 1))
        if [ $counter -gt 60 ]; then
            log "ERRO: Timeout aguardando MySQL após 60 segundos"
            exit 1
        fi
    done
    log "MySQL conectado!"

    # Executar migrações
    log "Executando migrações..."
    php artisan migrate --force --no-interaction
fi

# Limpar caches
log "Limpando caches..."
php artisan config:clear --no-interaction
php artisan cache:clear --no-interaction

# Definir permissões finais
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html/storage
chmod -R 755 /var/www/html/bootstrap/cache

log "Laravel App configurado com sucesso!"
log "Iniciando servidor na porta 8000..."

# Executar comando original
exec "$@"