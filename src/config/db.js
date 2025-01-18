const Sequelize = require('sequelize');
const config = require("./config");

const sequelize = new Sequelize(
  config.db.name,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect,
    dialectOptions: {
      instanceName: 'MSSQLSERVER',
  },
  },
);

// config.CON.sequelize = sequelize;
// config.CON.Sequelize = Sequelize;
// module.exports = config.CON;
module.exports = {
  sequelize  
}
