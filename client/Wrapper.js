/**
 * Created by watcher on 10/17/16.
 */
import React from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'

import Footer from './components/Footer';
import Header from './components/Header';
import Sidebar from './components/Sidebar.js';

import BackHeader from './components/ManagePanel/BackHeader'
import BackFooter from './components/ManagePanel/BackFooter'


class Wrapper extends React.Component {
    constructor(props) {
        super(props)
        this.state = {loginLevel: 0}
    }
    componentWillReceiveProps (nextProps) {
        let user = nextProps.loginedUser            
        if(user) {
            switch (user.profile.userType) {
                case 'customer':
                    this.setState({loginLevel: 1})
                    break
                case 'employee':
                    this.setState({loginLevel: 2})
                    break
                case 'admin':
                    this.setState({loginLevel: 3})
                    break
                default:
                    this.setState({loginLevel: 0})
                    break
            }
        }        
    }
    getChildContext() {
        return {
            loginLevel: this.state.loginLevel
        }
    }
    render () {
        let { children } = this.props
        if(location.href.indexOf('managePanel') != -1) {
            if(this.state.loginLevel == 2 || this.state.loginLevel == 3) {
                return (
                    <div id='main_container'>
                        <BackHeader />
                        <Sidebar side='backEnd' />
                        <div className='content'>
                            {children}
                        </div>
                        <BackFooter />
                    </div>
                )
            } else {
                return (
                    <div id='main_container'>
                        <Header />
                        <Sidebar />
                        <div className='content'>
                            Must login as admin or employee
                        </div>
                        <Footer />
                    </div>
                )
            }
        }
        return (
            <div id='main_container'>
                <Header />
                <Sidebar />
                <div className='content'>
                    {children}
                </div>
                <Footer />
            </div>
        )              
    }
}

Wrapper.childContextTypes = {
    loginLevel: React.PropTypes.number.isRequired
}

export default createContainer(({params}) => {
    Meteor.subscribe('users')
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
}, Wrapper)