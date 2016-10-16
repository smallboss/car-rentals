/**
 * Created by watcher on 10/16/16.
 */
import React from 'react'
import { Link } from 'react-router';
import './style.css'

class NavBar extends React.Component {
    render () {
        return (
            <ul className='m-y-1 nav nav-justified'>
                <li><Link to="/">Home</Link></li>
                <li><a href="/home/#services">Services</a></li>
                <li><a href="/home/#reviews">Reviews</a></li>
                <li><a href="/home/#location">Location</a></li>
                <li><a href="/home/#contact">Contact</a></li>
            </ul>
        )
    }
}

export default NavBar


/*
 <li><Link to="/">Home</Link></li>
 <li><Link to="/#services">Services</Link></li>
 <li><Link to="/#reviews">Reviews</Link></li>
 <li><Link to="/#location">Location</Link></li>
 <li><Link to="/#contact">Contact</Link></li>
 */