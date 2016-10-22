import React, { Component } from 'react';
import { Link } from 'react-router';
import Login from '../../Content/Login'
import '../../Header/style.css'

export default class BackHeader extends Component {
    render() {
        return (
            <nav className='row navbar header-nav'>
                <div className='col-xs-3'>
                    <div className='navbar-header'>
                        <Link className='navbar-brand m-x-2' to='/'>Cars Rentals</Link>
                    </div>
                </div>
                <div className='col-xs-6'>
                  
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


/*
 <nav className="header-nav navbar">
 <div className="navbar-header">
 <button className="navbar-toggle" type="button" data-toggle="collapse" data-target=".js-navbar-collapse">
 <span className="sr-only">Toggle navigation</span>
 <span className="icon-bar"></span>
 <span className="icon-bar"></span>
 <span className="icon-bar"></span>
 </button>
 <Link className="navbar-brand" to="/">Cars Rentals</Link>
 </div>
 <div className='pull-right'>
 <Login />
 </div>
 </nav>
 */