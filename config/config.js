if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = {
  development: {
    username: 'root',
    password: 'password',
    database: 'wapd_backend',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    username: process.env.CONFIG_USER_NAME,
    password: process.env.CONFIG_USER_PASS,
    database: 'wapd_backend_test',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
  },
  production: {
    use_env_variable: 'CLEARDB_DATABASE_URL'
  }
}
