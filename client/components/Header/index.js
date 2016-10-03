import React, { Component } from 'react';

import { Link } from 'react-router';

export default class Header extends Component {
  render() {
    return (
      <nav className="header-nav navbar navbar-inverse">
        <div className="navbar-header">
          <button className="navbar-toggle" type="button" data-toggle="collapse" data-target=".js-navbar-collapse">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link className="navbar-brand" to="/">Cars Rentals</Link>
        </div>
      </nav>
    )
  }
}