const Sequelize = require('sequelize');
const Faker = require('faker');
const _ = require('lodash');

const Conn = new Sequelize(
  'usermanagement',
  'root',
  'root',
  {
    dialect: 'mysql',
    host: 'localhost'
  }
);

const User = Conn.define('user', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  },
  dateofbirth: {
      type: Sequelize.DATE,
        allowNull: false,

  },


});



/* Conn.sync({ force: true }).then(()=> {
  _.times(3, ()=> {
    return User.create({
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email(),
      dateofbirth: Faker.date.recent(),
    })
  });
}); */

module.exports =  Conn;