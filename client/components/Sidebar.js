import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router';

const backEndMenu = function (adminLogin = 0) {
    return (
        <ul className="sidebar-nav">
          <li><Link to="/managePanel/customers_list">Customers</Link></li>
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
          {(adminLogin === 3) ? <li className="dropdown">
            <a type="button" data-toggle="dropdown">Reports
              <span className="caret"></span></a>
            <ul className="dropdown-menu">
              <li><Link to="/managePanel/cars_report">Cars</Link></li>
              <li><Link to="/managePanel/rentals">Rentals</Link></li>
            </ul>
          </li> : ''}
          <li className="dropdown">
            <a type="button" data-toggle="dropdown">Imports
              <span className="caret"></span></a>
            <ul className="dropdown-menu">
              <li><Link to="/managePanel/imports/fines">Fines</Link></li>
              <li><Link to="/managePanel/imports/tolls">Tolls</Link></li>
            </ul>
          </li>
          <li><Link to="/managePanel/users_list">All Users</Link></li>
          <li><Link to='/user_profile'>Profile</Link></li>
        </ul>
    )
}

class Sidebar extends Component {
  constructor(props, context) {
    super(props)
    this.state = {loginIn: props.loginIn || {}, loginLevel: context.loginLevel}
  }    
  componentWillReceiveProps(nextProps, nextContext) {      
    let loginLevel = nextContext.loginLevel
    this.setState({loginIn: nextProps.loginIn, loginLevel: loginLevel})
  }
  render() {      
    if(!this.state.loginIn) {
      return (
          <div></div>
      )
    }
    const adminPart = (this.state.loginLevel > 1) ? <li><Link to='/managePanel/' className='p-l-3'>Manage Panel</Link></li> : ''
    if(this.props.side && this.props.side == 'backEnd') {
      return (
          <div id='sidebar-wrapper'>
            {backEndMenu(this.state.loginLevel)}
          </div>
      )
    } else {
      const imgUser = (this.props.loginIn.profile._images && this.props.loginIn.profile._images.imgUser) ? this.props.loginIn.profile._images.imgUser : '/img/userImage.png'
      return (
          <div id='sidebar-wrapper'>
            <div id='circle-user' style={{backgroundImage: 'url(' + imgUser + ')'}}></div>
            <ul className='sidebar-nav'>
              <li><Link to='/user_profile' className='p-l-3'>Profile</Link></li>
                {(this.state.loginLevel === 1) ? <li><Link to='/user_profile/rental_history' className='p-l-3'>Rental History</Link></li> : '' }
                {(this.state.loginLevel === 1) ? <li><Link to='/user_profile/payments' className='p-l-3'>Payments</Link></li> : '' }
                {(this.state.loginLevel === 1) ?<li><Link to='/user_profile/contracts' className='p-l-3'>Contracts</Link></li> : '' }
                {(this.state.loginLevel === 1) ?<li><Link to='/user_profile/invoices' className='p-l-3'>Invoices</Link></li> : '' }
                {(this.state.loginLevel === 1) ? <li><Link to='/user_profile/car_requests' className='p-l-3'>Car Requests</Link></li> : ''}
              {adminPart}
            </ul>
          </div>
      )
    }
    
  }
}

Sidebar.contextTypes = {
  loginLevel: React.PropTypes.number.isRequired
}

export default createContainer(() => {
  Meteor.subscribe('users')
  return {
    loginIn: Meteor.user()
  }
}, Sidebar)


