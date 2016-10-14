import { Meteor } from 'meteor/meteor';
import '../imports/api/tasks.js';
import '../imports/api/cars.js';
import '../imports/api/customers.js';
import '../imports/api/payments.js';
import '../imports/api/lines.js';
import '../imports/api/invoices.js';
import '../imports/api/contracts.js';
import '../imports/api/users.js';
import '../imports/api/email.js';
import '../imports/api/yearWrite.js';

import './smtp.js';

Meteor.startup(() => {
  // code to run on server at startup
});
