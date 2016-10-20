import { Mongo } from 'meteor/mongo';

//create db table - tasks
export const ApiRentals = new Mongo.Collection('rentals');

//for return our TASKS data
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('rentals', function tasksPublication() {
    return ApiRentals.find();
  });
}