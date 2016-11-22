import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor'
import { ApiInvoices } from '/imports/api/invoices.js';
import { ApiUsers } from '/imports/api/users.js';

const rentals = new Mongo.Collection('rentals');

//create db table - tasks
export const ApiRentals = rentals;// = new Mongo.Collection('rentals');

export const removeRental = (rentalId) => {
    const customer = rentals.findOne({_id: rentalId});

    if (customer) 
      Meteor.users.update({_id: customer.customerId}, {$pull: {'profile.rentals': rentalId}});
    
    rentals.remove(rentalId);
}

export const changeRentalCustomer = (rentalId, newCustomerId) => {
    const invoice = ApiInvoices.findOne({rentals: {$in: [rentalId]}});
    ApiInvoices.update({_id: invoice._id}, {$pull: {rentals: rentalId}})
    rentals.remove(rentalId);
}

//for return our TASKS data
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('rentals', function tasksPublication() {
    return ApiRentals.find();
  });
}