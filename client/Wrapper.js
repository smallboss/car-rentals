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
        this.state = {loginLevel: 0, showSideBar: 0}
    }
    componentWillReceiveProps (nextProps) {
        let user = nextProps.loginedUser,
            loginLevel = 0,
            showSideBar = (location.href.indexOf('home') !== -1 || location.href.indexOf('registration') !== -1) ? 0 : 1
        if(user) {
            switch (user.profile.userType) {
                case 'customer':
                    loginLevel = 1
                    break
                case 'employee':
                    loginLevel = 2
                    break
                case 'admin':
                    loginLevel = 3
                    break
                default:
                    loginLevel = 0
                    break
            }
        }
        this.setState({loginLevel, showSideBar})
    }
    getChildContext() {
        return {
            loginLevel: this.state.loginLevel
        }
    }
    render () {
        let { children } = this.props
        if(location.href.indexOf('managePanel') !== -1) {
            if(this.state.loginLevel == 2 || this.state.loginLevel == 3) {
                return (
                    <div id='main_container'>
                        <BackHeader />
                        <div className='col-xs-3'>
                            <Sidebar side='backEnd' />
                        </div>
                        <div className='col-xs-9'>
                            <div className='content'>
                                {children}
                            </div>
                        </div>                        
                        <BackFooter />
                    </div>
                )
            } else {
                return (
                    <div id='main_container'>
                        <Header />
                        
                        <div className='content'>
                            Must login as admin or employee
                        </div>
                        <Footer />
                    </div>
                )
            }
        }
        return (this.state.showSideBar) ?
            <div id='main_container'>
                <Header />
                <div>
                    <div className='col-xs-3'>
                        <Sidebar />
                    </div>
                    <div className='col-xs-9'>
                        <div className='content'>
                            {children}
                        </div>
                    </div>
                </div>
                <Footer />
            </div> :
            <div id='main_container'>
                <Header />
                <div className='col-xs-12'>
                    <div className='content'>
                        {children}
                    </div>
                </div>
                <Footer />
            </div>
                      
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