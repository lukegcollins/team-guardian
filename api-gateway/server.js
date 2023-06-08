const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

//User Management Service
app.use('/ums', createProxyMiddleware({
    target: 'http://localhost:1001/',
    changeOrigin: true,
    pathRewrite: {
        '^/ums': '/',
    },
}));

// Team Management Service
app.use('/tms', createProxyMiddleware({
    target: 'http://localhost:1002/',
    changeOrigin: true,
    pathRewrite: {
        '^/tms': '/',
    },
}));

// WWCC Validation Service
app.use('/wwccvs', createProxyMiddleware({
    target: 'http://localhost:1003/',
    changeOrigin: true,
    pathRewrite: {
        '^/wwccvs': '/',
    },
}));

// First Aid Certificate Service
app.use('/facs', createProxyMiddleware({
    target: 'http://localhost:1004/',
    changeOrigin: true,
    pathRewrite: {
        '^/facs': '/',
    },
}));

// Frontend Service
app.use('/', createProxyMiddleware({
    target: 'http://localhost:1000/',
    changeOrigin: true,
}));

app.listen(3000, () => {
    console.log('API Gateway is running on http://localhost:3000');
});