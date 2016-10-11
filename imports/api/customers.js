import { Mongo } from 'meteor/mongo';
import Customer from './schemas/Customer'
//create db table - customers
export const ApiCustomers = new Mongo.Collection('customers');
//ApiCustomers.schema = new SimpleSchema(Customer)


//for return our Customers data
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('customers', function customersPublication() {
    return ApiCustomers.find();
  });
}