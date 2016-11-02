import { Mongo } from 'meteor/mongo';
import { ApiInvoices } from '/imports/api/invoices.js';

const rentals = new Mongo.Collection('rentals');

//create db table - tasks
export const ApiRentals = rentals;// = new Mongo.Collection('rentals');

export const removeRental = (rentalId) => {
    // const invoice = ApiInvoices.findOne({rentals: {$in: [rentalId]}});
    // ApiInvoices.update({_id: invoice._id}, {$pull: {rentals: rentalId}})
    // rentals.remove(rentalId);
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