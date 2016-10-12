/**
 * Created by watcher on 10/11/16.
 */
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

Meteor.methods({
    setPassword: function (userId, newPassword) {
        Accounts.setPassword({_id: userId}, newPassword)        
    },
    createNewUser: function (userData) {
        Accounts.createUser(userData)
    }
})

if(Meteor.isServer) {
    //Meteor.users.remove({})
    Meteor.publish('users', function publishUsers () {
        Meteor.users.allow({
            update: function (userId, doc, fields, modifier) {
                if(userId) {
                    return true   
                }                     
            },
            remove: function (userId, doc) {
                return true
            }
        })
        return Meteor.users.find()        
    })
}
