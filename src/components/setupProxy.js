const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/remotive',
    createProxyMiddleware({
      target: 'https://remotive.io',
      changeOrigin: true,
      pathRewrite: { '^/api/remotive': '/api/remote-jobs' }
    })
  );
};
