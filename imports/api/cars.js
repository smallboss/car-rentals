import { Mongo } from 'meteor/mongo';

//create db table - tasks
export const ApiCars = new Mongo.Collection('cars');

//for return our TASKS data
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('cars', function tasksPublication() {
    return ApiCars.find();
  });
}