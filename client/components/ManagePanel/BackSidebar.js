import React, { Component } from 'react';

import { Link } from 'react-router';

export default class BackSidebar extends Component {
  render() {
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