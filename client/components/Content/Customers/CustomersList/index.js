/**
 * Created by watcher on 10/5/16.
 */
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiCustomers } from '../../../../../imports/api/customers'
import React from 'react'

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
        console.log(this.state.customers)
        return (
            <div>
                List of Customers
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