const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const fs = require('fs');
const prompt = require('prompt-sync')();
const companyMaster = require('./makeTable');

const sequelize = new Sequelize('Tripuradb', 'root', 'varSHA_96', {
  host: 'localhost',
  dialect: 'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
  pool: {
    max: 20,
    min: 0,
    acquire: 1000000,
    idle: 10000,
  },
});

sequelize
  .sync()
  .then(() => {
    let f = true;

    while (f) {
      console.log(
        'Choose the cases:\nCase 1 \nCase 2 \nCase 3 \nCase 4 \ndefault->exit',
      );
      const name = prompt();
      const ch = parseInt(name, 10);
      switch (ch) {
        case 1: // testcase1
          console.log(
            '**********************************************First TestCase**********************************************',
          );
          const query = {
            attributes: [
              [
                Sequelize.literal(
                  'COUNT(CASE WHEN AuthorCap <= 100000 THEN 1 END)',
                ),
                '<= 1L',
              ],
              [
                Sequelize.literal(
                  'COUNT(CASE WHEN AuthorCap > 100000 AND AuthorCap <= 1000000 THEN 1 END)',
                ),
                '1L to 10L',
              ],
              [
                Sequelize.literal(
                  'COUNT(CASE WHEN AuthorCap > 1000000 AND AuthorCap <= 10000000 THEN 1 END)',
                ),
                '10L to 1Cr',
              ],
              [
                Sequelize.literal(
                  'COUNT(CASE WHEN AuthorCap > 10000000 AND AuthorCap <= 100000000 THEN 1 END)',
                ),
                '1Cr to 10Cr',
              ],
              [
                Sequelize.literal(
                  'COUNT(CASE WHEN AuthorCap > 100000000 THEN 1 END)',
                ),
                '> 10Cr',
              ],
            ],
          };

          companyMaster.findAll(query).then((result) => {
            // console.log(JSON.stringify(result, null, 4));

            const wrStream = fs.createWriteStream('./AuthorCap.json');
            const jsonString = JSON.stringify({ ...result }, undefined, 4);
            // console.log(jsonString);

            wrStream.write(jsonString, (err) => {
              if (err) {
                console.log(err.message);
              } else {
                console.log('bytes written');
              }
            });
          });

          f = true;
          break;

        case 2: // testcase 2
          console.log(
            '**********************************************Second TestCase**********************************************',
          );

          const query2 = {
            attributes: [
              'Year',
              [sequelize.fn('COUNT', sequelize.col('Year')), 'COUNT'],
            ],
            where: {
              Year: {
                [Op.between]: [2000, 2019],
              },
            },
            group: ['Year'],
            order: ['Year'],
          };

          companyMaster.findAll(query2).then((result) => {
            const getRes = JSON.stringify(result, undefined, 4);
            const obj = JSON.parse(getRes);

            const putYear = {};

            const keys = Object.keys(obj);
            for (let i = 0; i < keys.length; i++) {
              const subKey = obj[keys[i]];
              const year = subKey.Year;
              putYear[year] = subKey.COUNT;
            }
            console.log(putYear);

            const wrStream = fs.createWriteStream('./RegYear.json');
            const jsonString = JSON.stringify({ ...putYear }, undefined, 4);
            // console.log(jsonString);

            wrStream.write(jsonString, (err) => {
              if (err) {
                console.log(err.message);
              } else {
                console.log('bytes written');
              }
            });
          });

          f = true;
          break;

        case 3: // testcase 2
          console.log(
            '**********************************************Third TestCase**********************************************',
          );

          const query3 = {
            attributes: [
              'Buisness',
              [sequelize.fn('COUNT', sequelize.col('Buisness')), 'COUNT'],
            ],
            where: {
              Year: {
                [Op.eq]: 2015,
              },
            },
            group: ['Buisness'],
          };

          companyMaster.findAll(query3).then((result) => {
            const getRes = JSON.stringify(result, undefined, 4);
            const obj = JSON.parse(getRes);

            const putBusiness = {};

            const keys = Object.keys(obj);
            for (let i = 0; i < keys.length; i++) {
              const subKey = obj[keys[i]];
              const business = subKey.Buisness;
              putBusiness[business] = subKey.COUNT;
            }
            console.log(putBusiness);

            const wrStream = fs.createWriteStream('./Business.json');
            const jsonString = JSON.stringify({ ...putBusiness }, undefined, 4);
            // console.log(jsonString);

            wrStream.write(jsonString, (err) => {
              if (err) {
                console.log(err.message);
              } else {
                console.log('bytes written');
              }
            });
          });

          f = true;
          break;

        case 4: // testcase 4
          console.log(
            '**********************************************Fourth TestCase**********************************************',
          );

          const query4 = {
            attributes: [
              'Year',
              'Buisness',
              [sequelize.fn('COUNT', sequelize.col('Buisness')), 'COUNT'],
            ],
            where: {
              Year: {
                [Op.between]: [2000, 2019],
              },
            },
            group: ['Buisness', 'Year'],
            order: ['Year'],
          };

          companyMaster.findAll(query4).then((result) => {
            const getRes = JSON.stringify(result, undefined, 4);
            const obj = JSON.parse(getRes);
            // console.log(obj);

            const putYear = {};
            for (let i = 2000; i <= 2019; i += 1) {
              // putYear[i.toString()] = 0;
              putYear[i] = {};
              // var getActivity = {};
            }

            const keys = Object.keys(obj);
            for (let i = 0; i < keys.length; i++) {
              const subKey = obj[keys[i]];
              const year = subKey.Year;
              if (year >= 2000 && year <= 2019) {
                // putYear[year.toString()]++;
                const activity = subKey.Buisness;
                putYear[year][activity] = subKey.COUNT;
              }
            }
            console.log(putYear);

            const wrStream = fs.createWriteStream('./GroupAgg.json');
            const jsonString = JSON.stringify({ ...putYear }, undefined, 4);
            // console.log(jsonString);

            wrStream.write(jsonString, (err) => {
              if (err) {
                console.log(err.message);
              } else {
                console.log('bytes written');
              }
            });
          });

          f = true;
          break;

        default:
          f = false;
          break;
      }
    }
  })
  .catch((err) => {
    console.log(err);
  });
