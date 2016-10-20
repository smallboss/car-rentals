import { Mongo } from 'meteor/mongo';

//create db table - tasks
export const ApiContracts = new Mongo.Collection('contracts');

//for return our TASKS data
if (Meteor.isServer) {
  // This code only runs on the server
  ApiContracts.allow({
    update: function (userId, doc, fields, modifier) {
      return true
    },
    insert: (userId, doc) => {
      return true
    },
    remove: (userId, doc) => {
      let _type = Meteor.user().profile.userType
      return (_type !== 'admin') ? false : true
    }
  })
  Meteor.publish('contracts', function tasksPublication() {
    return ApiContracts.find();
  });
}