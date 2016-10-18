import { Mongo } from 'meteor/mongo';

//create db table - tasks
export const ApiPayments = new Mongo.Collection('payments');

//for return our TASKS data
if (Meteor.isServer) {
  //console.log(ApiPayments.find().fetch())
  //console.log(ApiPayments.find({_id: new Mongo.ObjectID('31eb4a96b7cc29ea367ebe36')}).fetch())
  console.log(ApiPayments.find().fetch())
  console.log('')
  // This code only runs on the server
  Meteor.publish('payments', function tasksPublication() {
    return ApiPayments.find();
  });
}