const Sequelize = require("sequelize");
const sequelize = new Sequelize("Tripuradb", "root", "varSHA_96", {
    host: "localhost",
    dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql'*/,
    pool: {
      max: 20,
      min: 0,
      acquire: 1000000,
      idle: 10000,
    },
  });  

const companyMaster= sequelize.define("CompanyMaster", {
    // Model attributes are defined here
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    CompanyName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Year: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    AuthorCap: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    Buisness: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  
  module.exports = companyMaster;