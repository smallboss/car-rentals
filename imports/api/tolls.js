/**
 * Created by watcher on 10/19/16.
 */
import { Mongo } from 'meteor/mongo'

export const ApiTolls = new Mongo.Collection('tolls')

if(Meteor.isServer) {
    ApiTolls.allow({
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
    Meteor.publish('tolls', () => {
        return ApiTolls.find()
    })    
}