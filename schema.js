const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");

const Db = require("./db");

const User = new GraphQLObjectType({
  name: "User",
  description: "This represents a User",
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(user) {
          return user.id;
        }
      },
      firstName: {
        type: GraphQLString,
        resolve(user) {
          return user.firstName;
        }
      },
      lastName: {
        type: GraphQLString,
        resolve(user) {
          return user.lastName;
        }
      },
      email: {
        type: GraphQLString,
        resolve(user) {
          return user.email;
        }
      },
      dateofbirth: {
        type: GraphQLString,
        resolve(user) {
          return user.dateofbirth;
        }
      },
      createdOn: {
        type: GraphQLString,
        resolve(user) {
          return user.createdOn;
        }
      }
    };
  }
});

const UserDetails = new GraphQLObjectType({
  name: "UserDetails",
  description: "This represents a UserDetails",
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(user) {
          return user.id;
        }
      },
      user_id: {
        type: GraphQLInt,
        resolve(user) {
          return user.user_id;
        }
      },
      gender: {
        type: GraphQLString,
        resolve(user) {
          return user.gender;
        }
      },
      hobby: {
        type: GraphQLString,
        resolve(user) {
          let userHobby = user.hobby;
          return userHobby;
        }
      },
      phone_no: {
        type: GraphQLString,
        resolve(user) {
          return user.phone_no;
        }
      },
      user: {
        type: new GraphQLList(User),
        resolve(parent, user) {
          data = Db.models.user.findAll({
            where: { id: parent.user_id }
          });
          return data;
        }
      },
      address: {
        type: new GraphQLList(UserAddress),
        resolve(parent, user) {
          data = Db.models["userAddress"].findAll({
            where: { user_id: parent.user_id }
          });
          return data;
        }
      }
    };
  }
});
const UserAddress = new GraphQLObjectType({
  name: "UserAddress",
  description: "This represents a UserAddress",
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(user) {
          return user.id;
        }
      },
      user_id: {
        type: GraphQLInt,
        resolve(user) {
          return user.user_id;
        }
      },
      defaultAddress: {
        type: GraphQLInt,
        resolve(user) {
          return user.defaultAddress;
        }
      },
      address: {
        type: GraphQLString,
        resolve(user) {
          return user.address;
        }
      },
      dateofbirth: {
        type: GraphQLString,
        resolve(user) {
          return user.dateofbirth;
        }
      }
    };
  }
});
const Query = new GraphQLObjectType({
  name: "Query",
  description: "Root query object",
  fields: () => {
    return {
      user: {
        type: new GraphQLList(User),
        args: { id: { type: GraphQLInt } },
        resolve(root, args) {
          return Db.models.user.findAll({
            where: args,
            order: [["id", "DESC"]]
          });
        }
      },
      user_details: {
        type: new GraphQLList(UserDetails),
        args: { user_id: { type: GraphQLInt } },
        resolve(root, args) {
          return Db.models["user-details"].findAll({
            where: args
          });
        }
      }
    };
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutations",
  description: "Functions to set stuff",
  fields() {
    return {
      addUser: {
        type: new GraphQLList(User),
        args: {
          firstName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          lastName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          email: {
            type: new GraphQLNonNull(GraphQLString)
          },
          dateofbirth: {
            type: new GraphQLNonNull(GraphQLString)
          },
          gender: {
            type: new GraphQLNonNull(GraphQLString)
          },
          hobby: {
            type: new GraphQLNonNull(GraphQLString)
          },
          phone_no: {
            type: new GraphQLNonNull(GraphQLString)
          },
          defaultAddress: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          address: {
            type: GraphQLString
          }
        },
        resolve(source, args) {
          let newData = Db.models.user.create({
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email.toLowerCase(),
            dateofbirth: new Date(args.dateofbirth)
          });
          newData.then(res => {
            Db.models["user-details"].create({
              user_id: res.id,
              gender: args.gender,
              hobby: args.hobby,
              phone_no: args.phone_no
            });
            Db.models["userAddress"].create({
              user_id: res.id,
              defaultAddress: args.defaultAddress,
              address: args.address
            });
          });

          let allData = Db.models.user.findAll({
            arguments: ["id", "firstName", "lastName", "email", "dateofbirth"],
            order: [["id", "DESC"]]
          });

          return allData;
        }
      },
      updateUser: {
        type: new GraphQLList(User),
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          firstName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          lastName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          email: {
            type: new GraphQLNonNull(GraphQLString)
          },
          dateofbirth: {
            type: new GraphQLNonNull(GraphQLString)
          },
          gender: {
            type: new GraphQLNonNull(GraphQLString)
          },
          hobby: {
            type: new GraphQLNonNull(GraphQLString)
          },
          phone_no: {
            type: new GraphQLNonNull(GraphQLString)
          },
          defaultAddress: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          address: {
            type: GraphQLString
          }
        },
        resolve(source, args) {
          Db.models.user.update(
            {
              firstName: args.firstName,
              lastName: args.lastName,
              email: args.email,
              dateofbirth: new Date(args.dateofbirth)
            },
            { where: { id: args.id } }
          );
        
          let data =  Db.models["user-details"].update(
            {
              hobby: args.hobby,
              gender: args.gender,
              phone_no: args.phone_no
            },
            { where: { user_id: args.id } }
          );
          data.then(res => {
            console.log(res, "argsargs");
          });
          Db.models["userAddress"].update(
            {
              address: args.address,
              defaultAddress: args.defaultAddress
            },
            { where: { user_id: args.id } }
          );
          let allData = Db.models.user.findAll({
            order: [["id", "DESC"]],
            arguments: ["id", "firstName", "lastName", "email", "dateofbirth"]
          });

          return allData;
        }
      },
      deleteUser: {
        type: new GraphQLList(User),
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve(source, args) {
          Db.models.user.destroy({ where: { id: args.id } });
          Db.models["user-details"].destroy({ where: { user_id: args.id } });
          Db.models["userAddress"].destroy({ where: { user_id: args.id } });

          let allData = Db.models.user.findAll({
            arguments: ["id", "firstName", "lastName", "email", "dateofbirth"],
            order: [["id", "DESC"]]
          });
          return allData;
        }
      }
    };
  }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

module.exports = Schema;
