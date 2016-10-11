import { Mongo } from 'meteor/mongo';

//create db table - tasks
export const ApiInvoices = new Mongo.Collection('invoices');

//for return our TASKS data
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('invoices', function tasksPublication() {
    return ApiInvoices.find();
  });
}