const Sequelize = require("sequelize");
const mysql = require("mysql2");
const fs = require("fs");
const csv = require("csv-parser");

// creating connection
const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "varSHA_96",
});

connection.connect((err) => {
  if (err) {
    console.log("Error connecting to Database", err);
    return;
  }
  console.log("Connection established");
  connection.query(
    "CREATE DATABASE IF NOT EXISTS Tripuradb;", //create db if it doesn't already exist
    (error) => {
      if (error) throw error;

      console.log("db created");
      connection.end();
    }
  );
});

//creating connection with sequelize
const sequelize = new Sequelize("Tripuradb", "root", "varSHA_96", {
  host: "localhost",
  dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
  pool: {
    max: 20,
    min: 0,
    acquire: 1000000,
    idle: 10000,
  },
});

// creating table schema
const companyMaster = sequelize.define("CompanyMaster", {
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

// This creates the table if it doesn't exist (and does nothing if it already exists)
let year = 0;

const companiesData = [];

sequelize
  .sync()
  .then((result) => {
    console.log(result);
    fs.createReadStream("C://Users//Acer//Downloads//Tripura.csv") // reads the data from csv file
      .pipe(csv())
      .on("data", (row) => {
        const getCap = row.DATE_OF_REGISTRATION;

        // console.log(getCap);
        if (getCap !== "NA") {
          let yr = getCap.substring(6);

          if (yr.length === 2) {
            const yrInt = parseInt(yr, 10);
            yr = yrInt >= 0 && yrInt <= 21 ? `20${yr}` : `19${yr}`;
            year = parseInt(yr, 10);
          } else {
            const mydate = new Date(getCap);
            year = mydate.getFullYear();
          }

          //creating the records and fields
          companiesData.push({
            id: row.CORPORATE_IDENTIFICATION_NUMBER,
            CompanyName: row.Company_Name,
            Year: year,
            AuthorCap: row.AUTHORIZED_CAP,
            Buisness: row.PRINCIPAL_BUSINESS_ACTIVITY_AS_PER_CIN,
          });
        }
      })
      .on("end", () => {
        companyMaster.bulkCreate(companiesData); //loading the whole bunch of records into mysql in one go
      });
  })
  .then((result) => {
    console.log(`Row inserted..\n${result}`);
  })
  .catch((err) => {
    console.log(err);
  });
