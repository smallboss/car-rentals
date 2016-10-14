/**
 * Created by watcher on 10/11/16.
 */
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

if(Meteor.isServer) {
    Meteor.methods({
        setNewPassword: function (data) {
            Accounts.setPassword(data.targetId, data.newPassword)             
        },
        createNewUser: function (userData) {
            return Accounts.createUser(userData)
        }
    })
    Meteor.users.allow({
        update: function (userId, doc, fields, modifier) {
            return true
        },
        remove: function (userId, doc) {
            return true
        }
    })
    //Meteor.users.remove({})
    Meteor.publish('users', function publishUsers () {        
        return Meteor.users.find()        
    })
}
