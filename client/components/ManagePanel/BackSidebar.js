import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router';

class BackSidebar extends Component {
  constructor() {
    super()
    this.state = {loginIn: 0, loginAdmin: 0}
  }
  componentWillReceiveProps(nextProps) {
    let loginIn = nextProps.loginIn
    if(loginIn) {
      let loginAdmin = (loginIn.profile.userType == 'admin') ? 1 : 0
      this.setState({loginIn: 1, loginAdmin})
    } else {
      this.setState({loginIn: 0, loginAdmin: 0})
    }
  }
  render() {
    console.log(this.props)
    console.log(this.state)
    if(!this.state.loginIn || !this.state.loginAdmin) {
      return (
          <div>Must login as admin</div>
      )
    }
    return (
        <div id="sidebar-wrapper">
          <ul className="sidebar-nav">
            <li><Link to="/managePanel/customers_list">Customers</Link></li>
            <li><Link to="/registration">Customer registration</Link></li>
            <li><Link to="/managePanel/cars">Cars</Link></li>
            <li className="dropdown">
              <a type="button" data-toggle="dropdown">Invoicing
                <span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><Link to="/managePanel/invoices">Invoices</Link></li>
                <li><Link to="/managePanel/payments">Payments</Link></li>
                <li><Link to="/managePanel/contracts">Contracts</Link></li>
              </ul>
            </li>
            <li className="dropdown">
              <a type="button" data-toggle="dropdown">Reports
                <span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><a href="#">Cars</a></li>
              </ul>
            </li>
            <li className="dropdown">
              <a type="button" data-toggle="dropdown">Imports
                <span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><a href="#">Fines</a></li>
                <li><a href="#">Tolls</a></li>
              </ul>
            </li>
            <li><Link to="/managePanel/users_list">All Users</Link></li>
            <li><Link to='/user_profile'>Profile</Link></li>
          </ul>
        </div>
    )
  }
}

export default createContainer(() => {
  Meteor.subscribe('users')
  return {
    loginIn: Meteor.user()
  }
}, BackSidebar)