/**
 * Created by watcher on 10/11/16.
 */
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { ApiPayments } from '/imports/api/payments'
import { ApiLines } from '/imports/api/lines'
import { ApiInvoices } from '/imports/api/invoices'
import { ApiContracts } from '/imports/api/contracts'

if(Meteor.isServer) {
    Meteor.methods({
        setNewPassword: function (data) {
            Accounts.setPassword(data.targetId, data.newPassword)             
        },
        createNewUser: function (userData) {
            return Accounts.createUser(userData)
        },
        removeAllUserData: function (id) {
            let lines = ApiLines.find({customerId: id}, {multi: true}).fetch()
            let invoices = ApiInvoices.find({customerId: id}, {multi: true}).fetch()
            let contracts = ApiContracts.find({customerId: id}, {multi: true}).fetch()
            let payments = ApiPayments.find({customerId: id}, {multi: true}).fetch()
            for (let i = 0; i < lines.length; i++) {
                if(lines[i]._id) {
                    ApiLines.remove({_id: new Mongo.ObjectID(lines[i]._id._str)})
                }
            }
            for (let i = 0; i < invoices.length; i++) {
                if(invoices[i]._id) {
                    ApiInvoices.remove({_id: new Mongo.ObjectID(invoices[i]._id._str)})
                }
            }
            for (let i = 0; i < contracts.length; i++) {
                if(contracts[i]._id) {
                    ApiContracts.remove({_id: new Mongo.ObjectID(contracts[i]._id._str)})
                }                
            }
            for (let i = 0; i < payments.length; i++) {
                if(payments[i]._id) {
                    ApiPayments.remove({_id: new Mongo.ObjectID(payments[i]._id._str)})
                }                
            }            
            Meteor.users.remove({_id: id})
        }
    })
    Meteor.users.allow({
        update: function (userId, doc, fields, modifier) {
            return true
        },
        insert: (userId, doc) => {
            return true
        },
        remove: (userId, doc) => {
            let _type = Meteor.user().profile.userType
            return (_type !== 'admin') ? false : true
        }
    })
    //Meteor.users.remove({})
    /*Create default user start*/
    if(!Meteor.users.find().count()) {
        let options = {
            username: 'admin',
            password: 'qqqqqq',
            email: 'admin_rental@gmail.com',
            profile: {
                name: 'admin',
                userType: 'admin'
            }
        }
        Accounts.createUser(options)
    }
    /*Create default user end*/
    //Meteor.users.remove({})
    Meteor.publish('users', function publishUsers () {        
        return Meteor.users.find()        
    })
}
