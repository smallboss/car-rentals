import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';

if (Meteor.isServer) {
    Meteor.methods({
      sendEmail: function (to, from, subject, text) {
	    this.unblock();
        let objToSend = {
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