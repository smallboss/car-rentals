import { Mongo } from 'meteor/mongo';

//create db table - tasks
export const ApiLines = new Mongo.Collection('lines');

//for return our TASKS data
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('lines', function tasksPublication() {
    return ApiLines.find();
  });
}