import React, { Component } from 'react';
import NavBar from '../NavBar'
import { Link } from 'react-router'
import Login from '../Content/Login'
import './style.css'

export default class Header extends Component {
  render() {
    return (
      <nav className='row navbar header-nav'>
          <div className='col-xs-3'>
              <div className='navbar-header'>
                  <Link className='navbar-brand m-x-2' to='/'>Cars Rentals</Link>
              </div>
          </div>
          <div className='col-xs-6'>
              <NavBar />
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

