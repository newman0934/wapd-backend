module.exports = {
  apps: [
    {
      name: 'app',
      script: './app.js',
      instances: 8,
      autorestart: true,
      watch: true,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
