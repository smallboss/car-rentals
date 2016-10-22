import React, { Component } from 'react';
import NavBar from '../NavBar'

export default class Footer extends Component {
  render() {
    return (
      <footer>
        <div className='clearfix'></div>
        <div className='row'>
          <div className='col-xs-3'></div>
          <div className='col-xs-7'>
            <NavBar />
          </div>
          <div className='col-xs-3'></div>
        </div>
        <div className='row text-center'>
            <a href='#'><img src='/img/facebook.png' /></a>
            <a href='#' className='m-x-2'><img src='/img/twitter.png' /></a>
            <a href='#'><img src='/img/instagram.png' /></a>
        </div>
      </footer>
    )
  }
}