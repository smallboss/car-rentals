import React, { Component } from 'react';

import { Link } from 'react-router';

export default class Sidebar extends Component {
  render() {
    return (
    <div id="sidebar-wrapper">
      <ul className="sidebar-nav">
        <li><Link to="customers">Customers</Link></li>
        <li><Link to="cars">Cars</Link></li>
        <li className="dropdown">
          <a type="button" data-toggle="dropdown">Invoicing
            <span className="caret"></span></a>
          <ul className="dropdown-menu">
            <li><a href="#">Invoices</a></li>
            <li><a href="#">Payments</a></li>
            <li><a href="#">Contracts</a></li>
          </ul>
        </li>
      </ul>
    </div>
    )
  }
}