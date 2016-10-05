import React, { Component } from 'react';
import { Mongo } from 'meteor/mongo'
import $ from 'jquery'
import { ApiCustomers } from '../../../../imports/api/customers'
import Registration from './Registration'
import CustomersList from './CustomersList'
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
    addUserHandler (e) {
        e.preventDefault()
        let _id = new Mongo.ObjectID()
        let _user = {
            _id,
            name: e.target[0].value,
            userName: e.target[1].value,
            email: e.target[2].value,
            birthDate: e.target[3].value,
            phone: e.target[4].value,
            password: e.target[5].value,
            role: 'customer'
        }
        ApiCustomers.insert(_user)
    }
    render() {
        return (
            <div>
                <h1>Customers</h1>
                <input type='button' className='btn btn-default' id='add_user_button' className='make-action' data-target='add_user_form' value='Registration' />
                <input type='button' className='btn btn-default' id='show_users_button' className='make-action' data-target='user_list' value='All users' />
                <div id='add_user_form' style={{display: 'none'}}>
                    <h3>Register user</h3>
                    <Registration addUserHandler={this.addUserHandler} />
                </div>
                <div id='users_list'>
                    <h3>User`s list</h3>
                    <CustomersList />
                </div>
            </div>
        )
    }
}