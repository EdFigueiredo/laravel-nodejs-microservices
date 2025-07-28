# Laravel + Node.js Microservices - Projeto Demonstrativo

Uma aplicação demonstrando comunicação entre microsserviços usando Laravel e Node.js com Docker.

## 🏗️ Arquitetura

- **Laravel App** (Porta 8000): API REST com CRUD de usuários
- **Node.js Microservice** (Porta 3001): Serviço auxiliar com dados mock
- **MySQL** (Porta 3306): Banco de dados principal

## 🚀 Como Executar

### Pré-requisitos
- Docker
- Docker Compose

### 🚀 Como Executar (Desenvolvimento Local)

#### 1. Clone e Configure
```bash
# Clonar o repositório
git clone [URL_DO_REPOSITORIO]
cd laravel-nodejs-microservices

# Copiar arquivos de configuração
cp docker-compose.example.yml docker-compose.yml
cp laravel-app/.env.example laravel-app/.env
```

#### 2. Configurar Senhas do Banco
Edite o `docker-compose.yml` e defina senhas para desenvolvimento:

```yaml
# Exemplo para desenvolvimento local:
environment:
  MYSQL_DATABASE: ${DB_DATABASE:-laravel_db}
  MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD:-dev_root_123}
  MYSQL_USER: ${DB_USERNAME:-laravel_user}
  MYSQL_PASSWORD: ${DB_PASSWORD:-dev_laravel_123}
```

#### 3. Configurar Laravel
Edite `laravel-app/.env` com as mesmas credenciais:

```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel_db
DB_USERNAME=laravel_user
DB_PASSWORD=dev_laravel_123
NODE_SERVICE_URL=http://node-service:3001
```

#### 4. Executar o Projeto
```bash
# Subir todos os containers
docker-compose up -d

# Gerar chave do Laravel
docker-compose exec laravel-app php artisan key:generate

# Verificar se está funcionando
docker-compose ps
curl http://localhost:8000/api/health
```

**✅ Pronto! Acesse:**
- **Laravel API**: http://localhost:8000
- **Node.js API**: http://localhost:3001  
- **MySQL**: localhost:3306

### Logs dos Serviços
```bash
# Laravel
docker-compose logs laravel-app

# Node.js
docker-compose logs node-service

# MySQL
docker-compose logs mysql
```

## 📋 Endpoints da API

### 🔹 Laravel API (http://localhost:8000)

#### Health Check
- `GET /api/health` - Status da aplicação e conexão com banco

#### Comunicação com Microsserviços
- `GET /api/external` - Consome dados do microsserviço Node.js

#### CRUD de Usuários
- `GET /api/users` - Listar todos os usuários
- `POST /api/users` - Criar novo usuário
- `GET /api/users/{id}` - Buscar usuário por ID
- `PUT /api/users/{id}` - Atualizar usuário
- `DELETE /api/users/{id}` - Deletar usuário

#### Informações da API
- `GET /api/` - Informações gerais da API

### 🔹 Node.js Microservice (http://localhost:3001)

#### Health Check
- `GET /health` - Status do microsserviço

#### Dados Mock
- `GET /data` - Dados consumidos pelo Laravel
- `GET /users` - Lista de usuários mock
- `GET /info` - Informações do sistema

#### Informações da API
- `GET /` - Informações gerais do microsserviço

## 🧪 Testando as Funcionalidades

### 1. Health Checks (Verificar se está funcionando)
```bash
# Status da API Laravel + Banco
curl http://localhost:8000/api/health

# Status do Microsserviço Node.js
curl http://localhost:3001/health

# Comunicação entre os serviços
curl http://localhost:8000/api/external
```

### 2. CRUD de Usuários

#### Criar Usuário
```bash
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

#### Listar Usuários
```bash
curl http://localhost:8000/api/users
```

#### Buscar Usuário Específico
```bash
curl http://localhost:8000/api/users/1
```

#### Atualizar Usuário
```bash
curl -X PUT http://localhost:8000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Atualizado",
    "email": "joao.novo@example.com"
  }'
```

#### Deletar Usuário
```bash
curl -X DELETE http://localhost:8000/api/users/1
```

### 3. Endpoints do Node.js
```bash
# Informações do microsserviço
curl http://localhost:3001/

# Dados mock para consumo
curl http://localhost:3001/data

# Usuários mock
curl http://localhost:3001/users
```

## 📊 Estrutura do Projeto

```
laravel-nodejs-microservices/
├── docker-compose.yml
├── docker-compose.example.yml
├── .gitignore
├── README.md
├── laravel-app/
│   ├── .env
│   ├── .env.example
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── HealthController.php
│   │   │   └── UserController.php
│   │   └── Models/
│   │       └── User.php
│   ├── routes/api.php
│   ├── database/migrations/
│   └── Dockerfile
├── node-microservice/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
```

## 🗄️ Banco de Dados

### Tabela Users
- `id` (int, auto-increment, primary key)
- `name` (varchar 255)
- `email` (varchar 255, unique)
- `password` (varchar 255, hash)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## 🐛 Solução de Problemas

### Container não inicia
```bash
# Verificar logs
docker-compose logs [service-name]

# Reconstruir imagem
docker-compose build [service-name]
```
### Reset completo
```bash
# Parar e remover tudo
docker-compose down -v

# Reconstruir e subir
docker-compose up -d --build
```

## 📁 Validação dos Endpoints

### Campos Obrigatórios para Usuários
- `name`: string, máximo 255 caracteres
- `email`: email válido e único
- `password`: string, mínimo 6 caracteres (apenas para criação)

### Códigos de Resposta
- `200` - Sucesso
- `201` - Criado com sucesso
- `422` - Dados de validação inválidos
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor
- `503` - Serviço indisponível

## 🔧 Tecnologias Utilizadas

- **Laravel 11** - Framework PHP para APIs robustas
- **Node.js 18** - Runtime JavaScript para microsserviços rápidos
- **Express.js** - Framework minimalista para Node.js
- **MySQL 8.0** - Banco de dados relacional
- **Docker & Docker Compose** - Containerização e orquestração
- **PHP 8.2** - Linguagem moderna com tipagem
- **Eloquent ORM** - Mapeamento objeto-relacional do Laravel
- **Artisan** - CLI do Laravel para tarefas automatizadas

## 🔒 Configurações para Desenvolvimento

### 📋 Senhas Padrão (Desenvolvimento Local)
Este projeto usa senhas simples para **desenvolvimento local**:

```yaml
# docker-compose.yml
MYSQL_ROOT_PASSWORD: dev_root_123
MYSQL_PASSWORD: dev_laravel_123
```

## 📈 Monitoramento

### Health Checks Automáticos
Todos os serviços incluem verificações de saúde:
- **Laravel**: `GET /api/health` (verifica app + banco)
- **Node.js**: `GET /health` (verifica uptime + memória)
- **MySQL**: `mysqladmin ping` (conectividade)

### Status dos Containers
```bash
# Ver status de todos os serviços
docker-compose ps

# Logs em tempo real
docker-compose logs -f

# Logs de um serviço específico
docker-compose logs laravel-app
```

## 🎓 Valor Educacional

### Para Estudantes
Este projeto demonstra:
- **Integração de diferentes tecnologias** (PHP + JavaScript)
- **Padrões de API REST** bem estruturados
- **Containerização** prática com Docker
- **Comunicação entre microsserviços**
- **Validação e tratamento de erros**

### Para Recrutadores
Habilidades demonstradas:
- **Full Stack Development** (Backend + DevOps)
- **Arquitetura de Software** (microsserviços)
- **Boas práticas** de desenvolvimento
- **Containerização** e orquestração
- **Documentação técnica** clara

### Para Desenvolvedores
Conceitos aplicados:
- **Clean Code** e organização de projeto
- **RESTful API Design**
- **Database Design** com migrations
- **Error Handling** padronizado
- **Environment Configuration**

