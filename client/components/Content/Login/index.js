/**
 * Created by watcher on 10/10/16.
 */
import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'
import LoginButtons from './LoginButtons'
import './style.css'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {loginedUser: props.loginedUser}
    }
    componentWillReceiveProps(nextProps) {
        this.setState({loginedUser: nextProps.loginedUser})
    }
    render () {
        if(!this.state.loginedUser) {
            return (
                <div>
                    <LoginButtons />
                </div>
            )   
        }
        let { name } = this.state.loginedUser.profile
        return (
            <div className='btn-group div-welcome m-r-1'>
                <span className='m-x-1'>Welcome, {name}</span>
                <button type='button' className='btn btn-success dropdown-toggle pull-right' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                    <span className='caret'></span>
                    <span className='sr-only'>Toggle Dropdown</span>
                </button>
                <ul className='dropdown-menu pull-right'>
                    <Link className='p-a-1' to='/user_profile'>My profile</Link>
                    <li role='separator' className='divider'></li>
                    <li className='p-a-1'><input type='button' className='btn btn-primary' value='Logout' onClick={() => {Meteor.logout(); browserHistory.push('/')}}/></li>
                </ul>
            </div>
        )
    }
}

export default createContainer(() => {
    let _id = Meteor.userId()
    if(_id) {
        return {
            loginedUser: Meteor.users.findOne({_id: _id})
        }
    } else {
        return {
            loginedUser: false
        }
    }
    
}, Login)

//export default Login