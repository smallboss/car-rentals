/**
 * Created by watcher on 10/19/16.
 */
import { Mongo } from 'meteor/mongo'

export const ApiFines = new Mongo.Collection('fines')

if(Meteor.isServer) {
    ApiFines.allow({
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
    Meteor.publish('fines', () => {
        return ApiFines.find()
    })    
}