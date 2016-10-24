import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import mongoXlsx  from 'mongo-xlsx';

var fs = Npm.require('fs');
var path = Npm.require('path');
var basePath = __dirname + '/';


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
      },

      export: function () {
      // this.unblock();
        let objToSend = {
          to: '11111',
          from: '111112',
          subject: '111113',
          text: '11114'
        }

        var data = [ { name : "Peter", lastName : "Parker", isSpider : true } , 
             { name : "Remy",  lastName : "LeBeau", powers : ["kinetic cards"] }];
 
        //  Generate automatic model for processing (A static model should be used) 
        var model = mongoXlsx.buildDynamicModel(data);
         
        // /* Generate Excel */
        // mongoXlsx.mongoData2Xlsx(data, model, function(err, data) {
        //   console.log('File saved at:', data.fullPath); 
        // });

       // var fd = fs.openSync(__dirname, 'w');


      // var data = [ { name : "Peter", lastName : "Parker", isSpider : true } ,
      //     { name : "Remy",  lastName : "LeBeau", powers : ["kinetic cards"] }];

      // console.log(__dirname);
      // fs.writeFileSync(__dirname + 'm.js', 'Hello Node.js', 'utf8');


        console.log(`SAVE EXCEL`);
      }
    })
}
