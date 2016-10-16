import React, { Component } from 'react';
import { Link } from 'react-router';
import Login from '../Content/Login'
import './style.css'

export default class Header extends Component {
  render() {
    return (
      <nav className='row navbar header-nav'>
          <div className='col-xs-2'>
              <div className='navbar-header'>
                  <Link className='navbar-brand m-x-3' to='/'>Cars Rentals</Link>
              </div>
          </div>
          <div className='col-xs-7'>
              <ul className='m-y-1 nav nav-justified'>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/#services">Services</Link></li>
                  <li><Link to="/#reviews">Reviews</Link></li>
                  <li><Link to="/#location">Location</Link></li>
                  <li><Link to="/#contact">Contact</Link></li>
              </ul>
          </div>
          <div className='col-xs-3'>
              <div className='pull-right m-y-1 m-x-3'>
                  <Login />
              </div>
          </div>
      </nav>
    )
  }
}

