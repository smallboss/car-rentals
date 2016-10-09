import React, { Component } from 'react';
import { Link } from 'react-router'
import './styles.css'

export default class Customers extends Component {
    componentDidMount () {
        [...document.getElementsByClassName('make-action')].forEach((button) => {
            button.addEventListener('click', (e) => {
                let _target = $('#' + e.target.id).attr('data-target')
                $('#' + _target).toggle()
            })
        })
    }
    render() {
        return (
            <div>
                <h1>Customers</h1>
                <Link to='/registration'>Registration</Link>
                <Link to='/customers_list' className='p-x-1'>Customers List</Link>                
            </div>
        )
    }
}