/** @format */
const { users, tasks } = require('../constants');

module.exports = {
  Query: {
    users: () => users,
    user: (_, args) => users.find((user) => user.id === args.id),
  },

  Mutation: {},

  User: {
    tasks: (parent) => tasks.filter((task) => task.userId === parent.id),
  },
};
