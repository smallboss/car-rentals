/**
 * Created by watcher on 10/19/16.
 */
import { Mongo } from 'meteor/mongo'

export const ApiFines = new Mongo.Collection('fines')

if(Meteor.isServer) {
    Meteor.publish('fines', () => {
        return ApiFines.find()
    })    
}