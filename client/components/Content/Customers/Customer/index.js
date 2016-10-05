/**
 * Created by watcher on 10/5/16.
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiCustomers } from '../../../../../imports/api/customers'
import React from 'react'

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
        return (
            <div className='panel panel-default'>
                <div>
                    
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