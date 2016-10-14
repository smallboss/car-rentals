import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';

if (Meteor.isServer) {
    Meteor.methods({
      sendEmail: function (to, from, subject, text) {
        check([to, from, subject, text], [String]);
        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        console.log('SEND EMAIL');
        this.unblock();

        Email.send({
          to: 'tokanevgeniy@gmail.com',
          from: 'smallboss@live.ru',
          subject: 'test meteor sender',
          text: 'SEND FROM METEOR!!!111one'
        });
      }
    });
}