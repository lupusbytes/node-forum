const config = require("./config/mysql_credentials");

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      database: config.database,
      user:     config.user,
      password: config.password,
      host:     config.host
    }
  }
};