import React, { Component } from 'react';
import Registration from './Registration'
import './styles.css'

export default class Customers extends Component {
    addUserHandler (e) {
        e.preventDefault()
        let _user = {
            name: e.target[0].value,
            userName: e.target[1].value,
            email: e.target[2].value,
            birthDate: e.target[3].value,
            phone: e.target[4].value,
            password: e.target[5].value
        }
    }
    render() {
        return (
            <div>
                <h1>Customers</h1>
                <input className='btn btn-default' id='add_user_button' name='make-action' defaultValue='Registration' />
                <div id='add_user_form'>
                    <h3>Register user</h3>
                    <Registration register={this.addUserHandler} />
                </div>
            </div>
        )
    }
}