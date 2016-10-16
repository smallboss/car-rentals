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
        this.state = {loginedUser: 0, adminLogin: 0}
    }
    componentWillReceiveProps (nextProps) {
        if(nextProps.loginedUser && (nextProps.loginedUser.profile.userType == 'admin' || nextProps.loginedUser.profile.userType == 'employee')) {
            this.setState({loginedUser: nextProps.loginedUser, adminLogin: 1})
        } else {
            this.setState({loginedUser: nextProps.loginedUser})   
        }        
    }
    render () {
        let { children } = this.props
        if(location.href.indexOf('managePanel') != -1) {
            if(this.state.adminLogin) {
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