import { Mongo } from 'meteor/mongo';

//create db table - tasks
export const ApiUserList = new Mongo.Collection('userList');


//for return our TASKS data
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('userList', function tasksPublication() {
    return Meteor.users.find();
  });
}