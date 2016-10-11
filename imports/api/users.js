/**
 * Created by watcher on 10/11/16.
 */
if(Meteor.isServer) {
    Meteor.publish(Meteor.users.find(), function publishUsers () {
        //Meteor.users.remove({})
        Meteor.users.allow({
            update: function (userId, doc, fields, modifier) {
                return true
            },
            remove: function (userId, doc) {
                return true
            }
        })
        return Meteor.users.find({}, {fields: {'password': 0}})
    })
}
