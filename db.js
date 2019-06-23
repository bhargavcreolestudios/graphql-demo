const Sequelize = require("sequelize");
const Faker = require("faker");
const _ = require("lodash");

const Conn = new Sequelize("usermanagement", "root", "root", {
  dialect: "mysql",
  host: "localhost"
});

const User = Conn.define("user", {
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
    type: Sequelize.DATEONLY,
    allowNull: false
  }
});
const UserDetails = Conn.define("user-details", {
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  gender: {
    type: Sequelize.STRING,
    allowNull: false
  },
  hobby: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phone_no: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
const UserAddress = Conn.define("userAddress", {
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  defaultAddress: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// UserAddress.sync({ force: true });

//  Conn.sync({ force: true }).then(()=> {
//   _.times(5, ()=> {
//     return User.create({
//       firstName: Faker.name.firstName(),
//       lastName: Faker.name.lastName(),
//       email: Faker.internet.email(),
//       dateofbirth: Faker.date.recent(),
//     })
//   });
// });

// Conn.sync({ force: true }).then(() => {
//   _.times(2, () => {
//     let genders = ["female", "male"];
//     let gender = Faker.random.arrayElement(genders);
//     return UserDetails.create({
//       user_id: Faker.random.number(),
//       gender: gender,
//       hobby: JSON.stringify([Faker.helpers.randomize()]),
//       phone_no: Faker.phone.phoneNumber()
//     });
//   });
// });

// Conn.sync({ force: true }).then(() => {
//   _.times(2, () => {

//     return UserAddress.create({
//       user_id: Faker.random.number(),
//       defaultAddress: 0,
//       address:Faker.address.streetAddress(),
    
//     });
//   });
// });

module.exports = Conn;
