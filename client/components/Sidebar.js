import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router';

class Sidebar extends Component {
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
    if(!this.state.loginIn) {
      return (
          <div></div>
      )
    }
    const adminPart = (this.state.loginAdmin) ? <li className='dropdown'>
      <a type='button' data-toggle='dropdown'>Admin Panel
        <span className='caret m-l-3'></span></a>
      <ul className='dropdown-menu' id='admin_part'>
        <li><Link to='/managePanel/'>Manage Panel</Link></li>
      </ul>
    </li> : '' 
    return (
      <div id='sidebar-wrapper'>
        <ul className='sidebar-nav m-x-3'>
          <li><Link to='/user_profile' className='navbar-link'>Profile</Link></li>
          <li><Link to='/user_profile/history'>Rental History</Link></li>
          <li><Link to='/user_profile/payments'>Payments</Link></li>
          <li><Link to='/user_profile/contracts'>Contracts</Link></li>
          <li><Link to='/user_profile/invoices'>Invoices</Link></li>
          {adminPart}
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
}, Sidebar)


/*

 <li className='dropdown'>
 <a type='button' data-toggle='dropdown'>Admin part
 <span className='caret m-l-3'></span></a>
 <ul className='dropdown-menu' id='admin_part'>
 <li><Link to='/customers_list'>Customers</Link></li>
 <li><Link to='/cars'>Cars</Link></li>
 <li><a href='#'>Fines</a></li>
 <li><a href='#'>Tolls</a></li>
 <li><Link to='/users_list'>All Users</Link></li>
 </ul>
 </li>
 */