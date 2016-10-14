import { Mongo } from 'meteor/mongo';

//create db table - tasks
export const ApiContracts = new Mongo.Collection('contracts');

//for return our TASKS data
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('contracts', function tasksPublication() {
    return ApiContracts.find();
  });
}