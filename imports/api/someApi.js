/**
 * Created by watcher on 10/22/16.
 */
/* for normal work module mongo-xlsx need set 
 path: path.resolve('../../../../../') + '/public/fromBase/', it must be at 81 string in node_modules/mongo-xlsx/lib/xlsx-rw.js
 */

import { ApiPayments } from '/imports/api/payments'
var mongoXlsx = require('mongo-xlsx');

Meteor.methods({
    exportMongoToExcel: function () {
        /*var data = [
            {name: "Peter", lastName: "Parker", isSpider: true},
            {name: "Remy", lastName: "LeBeau", powers: ["kinetic cards"]}
        ];*/
        const data = ApiPayments.find({}).fetch()
        //Generate automatic model for processing (A static model should be used)
        var model = mongoXlsx.buildDynamicModel(data);
        // Generate Excel
        mongoXlsx.mongoData2Xlsx(data, model, function (err, data) {
            console.log('File saved at:', data.fullPath);
        });
    }
})

