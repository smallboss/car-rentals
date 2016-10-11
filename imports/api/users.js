/**
 * Created by watcher on 10/11/16.
 */
import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'

Meteor.methods({
    setPassword: function (userId, newPassword) {
        Accounts.setPassword(userId, newPassword)
    }
})

if(Meteor.isServer) {
    Meteor.publish(Meteor.users.find(), function publishUsers (params) {
        console.log(params)
        //Meteor.users.remove({})
        Meteor.users.allow({
            update: function (userId, doc, fields, modifier) {
                return userId === doc._id
            },
            remove: function (userId, doc) {
                return true
            }
        })
        return Meteor.users.find({}, {fields: {'password': 0}})        
    })
}
