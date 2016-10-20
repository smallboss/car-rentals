import { Mongo } from 'meteor/mongo';

//create db table - tasks
export const ApiPayments = new Mongo.Collection('payments');

//for return our TASKS data
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('payments', function tasksPublication() {
    return ApiPayments.find();
  });
}