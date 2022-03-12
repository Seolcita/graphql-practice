/** @format */

const { users, tasks } = require('../constants');
const uuid = require('uuid');

module.exports = {
  Query: {
    tasks: () => tasks,
    task: (_, args) => tasks.find((task) => task.id === args.id),
  },

  Mutation: {
    createTask: (_, args) => {
      const task = { ...args.input, id: uuid.v4() };
      tasks.push(task);
      return task;
    },
  },

  Task: {
    // parent >> each task >> ex) { id: '1', name: 'Work', completed: false, userId: '3' },
    user: (parent) => users.find((user) => user.id === parent.userId),
  },
};
