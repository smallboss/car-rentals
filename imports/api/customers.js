import { Mongo } from 'meteor/mongo';

export const ApiCustomers = new Mongo.Collection('customers');

if(Meteor.isServer) {
  Meteor.publish('customers', function publishCustomers () {
    //Meteor.users.remove({})
    Meteor.users.allow({
      update: function (userId, doc, fields, modifier) {
        return true
      },
      remove: function (userId, doc) {
        return true
      }
    })
    return Meteor.users.find({"profile.userType": "customer"}, {fields: {'password': 0}})
  })

}


/*
//create db table - customers
export const ApiCustomers = new Mongo.Collection('customers');
//ApiCustomers.schema = new SimpleSchema(Customer)


//for return our Customers data
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('customers', function customersPublication() {
    return ApiCustomers.find();
  });
}*/
