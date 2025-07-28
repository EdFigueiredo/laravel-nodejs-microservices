const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'node-microservice',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: process.uptime()
    });
});

// Data endpoint que o Laravel pode consumir
app.get('/data', (req, res) => {
    const mockData = {
        message: 'Dados do microsserviço Node.js',
        timestamp: new Date().toISOString(),
        data: {
            items: [
                { id: 1, name: 'Item 1', value: 'Valor A' },
                { id: 2, name: 'Item 2', value: 'Valor B' },
                { id: 3, name: 'Item 3', value: 'Valor C' }
            ],
            total: 3,
            source: 'node-microservice'
        },
        meta: {
            service: 'node-microservice',
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'development'
        }
    };
    
    res.json(mockData);
});

// Endpoint para informações do sistema
app.get('/info', (req, res) => {
    res.json({
        service: 'Node.js Microservice',
        description: 'Microsserviço exemplo para integração com Laravel',
        version: '1.0.0',
        node_version: process.version,
        platform: process.platform,
        memory_usage: process.memoryUsage(),
        pid: process.pid,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        endpoints: [
            'GET /health - Health check',
            'GET /data - Mock data for Laravel',
            'GET /info - Service information',
            'GET /users - Users mock data'
        ]
    });
});

// Endpoint mock de usuários
app.get('/users', (req, res) => {
    const mockUsers = {
        message: 'Lista de usuários mock do Node.js',
        data: [
            {
                id: 101,
                name: 'João Node',
                email: 'joao@node.com',
                service: 'node-microservice'
            },
            {
                id: 102,
                name: 'Maria Express',
                email: 'maria@express.com',
                service: 'node-microservice'
            },
            {
                id: 103,
                name: 'Pedro API',
                email: 'pedro@api.com',
                service: 'node-microservice'
            }
        ],
        total: 3,
        source: 'node-microservice',
        timestamp: new Date().toISOString()
    };
    
    res.json(mockUsers);
});

// Endpoint raiz com informações da API
app.get('/', (req, res) => {
    res.json({
        message: 'Node.js Microservice API',
        version: '1.0.0',
        description: 'Microsserviço para integração com Laravel',
        endpoints: {
            health: '/health',
            data: '/data',
            info: '/info',
            users: '/users'
        },
        timestamp: new Date().toISOString()
    });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint não encontrado',
        message: `Rota ${req.method} ${req.originalUrl} não existe`,
        available_endpoints: ['/', '/health', '/data', '/info', '/users'],
        timestamp: new Date().toISOString()
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro:', err.stack);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: err.message,
        timestamp: new Date().toISOString()
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Node.js Microservice rodando na porta ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🏥 Health: http://localhost:${PORT}/health`);
    console.log(`📊 Data: http://localhost:${PORT}/data`);
    console.log(`ℹ️  Info: http://localhost:${PORT}/info`);
    console.log(`👥 Users: http://localhost:${PORT}/users`);
});

module.exports = app; 