import React, { Component } from 'react';

import { Link } from 'react-router';

export default class Sidebar extends Component {
  render() {
    return (
      <div id="sidebar-wrapper">
        <ul className="sidebar-nav">
          <li><Link to="/customers_list">Customers</Link></li>
          <li><Link to="/registration">Customer registration</Link></li>
          <li><Link to="/cars">Cars</Link></li>
          <li className="dropdown">
            <a type="button" data-toggle="dropdown">Invoicing
              <span className="caret"></span></a>
            <ul className="dropdown-menu">
              <li><Link to="/invoices">Invoices</Link></li>
              <li><Link to="/payments">Payments</Link></li>
              <li><a href="#">Contracts</a></li>
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
          <li><Link to="/cars">All Users</Link></li>
          <li><Link to="/cars">Profile</Link></li>
        </ul>
      </div>
    )
  }
}