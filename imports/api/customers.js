import { Mongo } from 'meteor/mongo';

//create db table - tasks
export const ApiCustomers = new Mongo.Collection('customers');

//for return our TASKS data
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('customers', function tasksPublication() {
    return ApiCustomers.find();
  });
}