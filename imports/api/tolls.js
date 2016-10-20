/**
 * Created by watcher on 10/19/16.
 */
import { Mongo } from 'meteor/mongo'

export const ApiTolls = new Mongo.Collection('tolls')

if(Meteor.isServer) {
    Meteor.publish('tolls', () => {
        return ApiTolls.find()
    })    
}