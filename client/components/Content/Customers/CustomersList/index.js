/**
 * Created by watcher on 10/5/16.
 */
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiCustomers } from '../../../../../imports/api/customers'
import React from 'react'
import $ from 'jquery'
import CustomerForTable from '../CustomerForTable'
import Pagination from '../Pagination'

class CustomersList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            customers: [],
            currentPage: 1,
            elemsOnPage: 3,
            maxPage: 0,
            stateForRemove: []            
        }
        this.handlerPagination = this.handlerPagination.bind(this)
        this.handlerDeleteCustomer = this.handlerDeleteCustomer.bind(this)
    }
    componentWillReceiveProps(nextProps) {
        let _customers = nextProps.customers
        let maxPage = Math.ceil(_customers.length / this.state.elemsOnPage)
        this.setState({customers: _customers, maxPage})
    }
    shouldComponentUpdate (nextProps, nextState) {
        let _check = (nextState.stateForRemove.length > 0 ) ? 0 : 1
        return _check
    }
    handlerPagination (num) {
        this.setState({currentPage: num})
    }
    handlerDeleteCustomer (e) {
        let arrForRemove = this.state.stateForRemove,
            { id, name } = e.target
        switch (name) {
            case 'checkbox-for-delete':
                if($(e.target).is(':checked')){
                    arrForRemove.push(id)
                } else {
                    arrForRemove = arrForRemove.filter(elem => {
                        if (elem != id) {
                            return elem
                        }
                    })
                }
                this.setState({stateForRemove: arrForRemove})
                break
            case 'remover-users':
                arrForRemove.map(elem => {
                    ApiCustomers.remove({_id: new Mongo.ObjectID(elem)})
                })
                this.setState({stateForRemove: []})                
                break
            default: break
        }
    }
    render () {        
        let currentNums = this.state.currentPage * this.state.elemsOnPage
        let _customers = this.state.customers.slice(currentNums - this.state.elemsOnPage, currentNums)
        return (
            <div>
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User login</th>
                            <th>User name</th>
                            <th>User email</th>
                            <th>User BirthDate</th>
                            <th>User role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_customers.map(customer => {
                            return (
                                <CustomerForTable customer_data={customer} handlerDeleteCustomer={this.handlerDeleteCustomer} key={Math.random()} />
                            )
                        })}
                    </tbody>
                </table>
                <input type='button' className='btn btn-danger' name='remover-users' value='Delete users' onClick={this.handlerDeleteCustomer} />
                {(this.state.maxPage > 1) ? <div className='text-center'>
                    <Pagination num={this.state.maxPage} handlerPagination={this.handlerPagination} key={Math.random()} />
                </div> : ''}                
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