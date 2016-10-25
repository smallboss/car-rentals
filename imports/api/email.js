import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { ApiPayments } from './payments'
import mongoXlsx  from  'mongo-xlsx';

var fs = Npm.require('fs');
var path = Npm.require('path');
var basePath = __dirname + '/';


if (Meteor.isServer) {
    Meteor.methods({
      sendEmail: function (to, from, subject, text) {
	    this.unblock();
        let objToSend = {
          // to: 'tokanevgeniy@gmail.com',
          to,
          from,
          subject,
          text
        }
        console.log(`SEND EMAIL to ${to}`);
        Email.send(objToSend);
      }
    })
}
