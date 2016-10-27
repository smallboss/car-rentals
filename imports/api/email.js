import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { ApiPayments } from './payments'


if (Meteor.isServer) {
    Meteor.methods({
      sendEmail: function (to, from, subject, text) {
        // check([to, from, subject, text], [String]);
        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        console.log('SEND EMAIL', to);
        this.unblock();

        Email.send({
          to,
          // to: 'tokanevgeniy@gmail.com',
          from: 'smallboss@live.ru',
          subject,
          html: text
        });
      }
    });
}
