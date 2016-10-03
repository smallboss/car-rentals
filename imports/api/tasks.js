import { Mongo } from 'meteor/mongo';

//create db table - tasks
export const Tasks = new Mongo.Collection('tasks');

//for return our TASKS data
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find();
  });
}