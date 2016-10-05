/**
 * Created by watcher on 10/5/16.
 */
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiCustomers } from '../../../../../imports/api/customers'
import React from 'react'
import Customer from '../Customer'

class CustomersList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            customers: []
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({...nextProps})
    }
    render () {
        return (
            <div>
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th>User login</th>
                            <th>User name</th>
                            <th>User email</th>
                            <th>User Birth date</th>
                            <th>User role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.customers.map(customer => {
                            return (
                                <Customer customer_data={customer} key={Math.random()} />
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default createContainer(() => {
    Meteor.subscribe('customers')
    return {
        customers: ApiCustomers.find({role: 'customer'}).fetch()
    }
}, CustomersList)