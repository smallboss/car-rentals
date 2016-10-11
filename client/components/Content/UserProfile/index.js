/**
 * Created by watcher on 10/11/16.
 */
import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { createContainer } from 'meteor/react-meteor-data'

class UserProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {user: props.user}
    }
    componentWillMount() {
        this.setState({user: this.props.user})
    }
    componentWillReceiveProps (nextProps) {
        this.setState({user: nextProps.user})
    }
    render () {
        let { username, emails, profile } = this.state.user
        let email = emails[0].address
        let { userType, name, birthDate, phone, address } = profile
        return (
            <div>
                {username}
            </div>
        )
    }
}

export default createContainer(() => {
    Meteor.subscribe('users')
    let _id = Session.get('user')
    return {
        user: Meteor.users.findOne({_id: _id})
    }
}, UserProfile)

//export default UserProfile