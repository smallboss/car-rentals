/**
 * Created by watcher on 10/5/16.
 */
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiCustomers } from '../../../../../imports/api/customers'
import React from 'react'
import CustomerForTable from '../CustomerForTable'
import Pagination from '../Pagination'

class CustomersList extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            customers: [],
            currentPage: 1,
            elemsOnPage: 3,
            maxPage: 0
        }
        this.handlerPagination = this.handlerPagination.bind(this)
        this.routerToCustomer = this.routerToCustomer.bind(this)
        context.router
    }
    componentWillReceiveProps(nextProps) {
        let _customers = nextProps.customers
        let maxPage = Math.ceil(_customers.length / this.state.elemsOnPage)
        this.setState({customers: _customers, maxPage})
    }
    handlerPagination (num) {
        this.setState({currentPage: num})
    }
    routerToCustomer (id) {
        this.context.router.push(`/customers/${id}`)
    }
    render () {
        let currentNums = this.state.currentPage * this.state.elemsOnPage
        let _customers = this.state.customers.slice(currentNums - this.state.elemsOnPage, currentNums)
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
                        {_customers.map(customer => {
                            return (
                                <CustomerForTable customer_data={customer} routerToCustomer={this.routerToCustomer} key={Math.random()} />
                            )
                        })}
                    </tbody>
                </table>
                {(this.state.maxPage > 1) ? <div className='text-center'>
                    <Pagination num={this.state.maxPage} handlerPagination={this.handlerPagination} key={Math.random()} />
                </div> : ''}
            </div>
        )
    }
}

CustomersList.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default createContainer(() => {
    Meteor.subscribe('customers')
    return {
        customers: ApiCustomers.find({role: 'customer'}).fetch()
    }
}, CustomersList)