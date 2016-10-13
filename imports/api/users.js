/**
 * Created by watcher on 10/11/16.
 */
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

if(Meteor.isServer) {
    Meteor.methods({
        setNewPassword: function () {
            let { targetId, newPassword } = arguments[0] // or function ({targetId, newPassword}) {...
            console.log(targetId)    //string !may be sometimes undefined?
            console.log(newPassword) //string
            //Accounts.setPassword(targetId, newPassword) //sometimes work
            Accounts.setPassword('ofy3ShAuk4dpRQhjS', newPassword)  //working if set targetId manually && targetId = undefined
        },
        createNewUser: function (userData) {
            Accounts.createUser(userData)
        }
    })

    //Meteor.users.remove({})
    console.log(Meteor.users.find().fetch())
    console.log('')
    Meteor.publish('users', function publishUsers () {
        Meteor.users.allow({
            update: function (userId, doc, fields, modifier) {
                return true
            },
            remove: function (userId, doc) {
                return true
            }
        })
        return Meteor.users.find()        
    })
}
