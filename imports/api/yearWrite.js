import { Mongo } from 'meteor/mongo';

//create db table - tasks
export const ApiYearWrite = new Mongo.Collection('yearwrite');

//for return our TASKS data
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('yearwrite', function tasksPublication() {
    return ApiYearWrite.find();
  });
}