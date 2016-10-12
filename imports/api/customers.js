//import { Mongo } from 'meteor/mongo';
//export const ApiUsers = Meteor.users

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