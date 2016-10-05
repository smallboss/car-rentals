/**
 * Created by watcher on 10/5/16.
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiCustomers } from '../../../../../imports/api/customers'
import React from 'react'
import './style.css'

class Customer extends React.Component {
    constructor () {
        super()
        this.state = {customer: {}}
    }
    componentWillReceiveProps (nextProps) {
        this.setState({customer: nextProps.customer[0]})
    }
    render () {
        console.log(this.state.customer)
        let { name, userName, email, birthDate, phone, role} = this.state.customer
        return (
            <div className='panel panel-default'>
                <div className='panel-heading'>
                    <h4>{name} / {userName}</h4>
                    <input type='button' className='btn btn-primary p-x-1' value='Print' />
                    <input type='button' className='btn btn-primary p-x-1 m-x-1' value='Save' />
                    <input type='button' className='btn btn-primary p-x-1' value='Edit' />
                    <input type='button' className='btn btn-primary p-x-1 m-x-1' value='Delete' />
                </div>
                <div className='panel-body'>
                    <div className='row'>
                        <div className='col-xs-6'>
                            <label htmlFor='name' className='col-xs-3'>Name</label>
                            <div className='col-xs-9 form-horizontal'>
                                <input type='text' value={name} disabled/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default createContainer(({params}) => {
    Meteor.subscribe('customers')
    let _id = params.id
    return {
        customer: ApiCustomers.find({_id: new Mongo.ObjectID(_id)}).fetch()        
    }
}, Customer)