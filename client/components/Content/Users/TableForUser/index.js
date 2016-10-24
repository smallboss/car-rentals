/**
 * Created by watcher on 10/8/16.
 */
import React from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiPayments } from '/imports/api/payments'
import { ApiInvoices } from '/imports/api/invoices'
import { ApiContracts } from '/imports/api/contracts'
import { ApiRentals } from '/imports/api/rentals'
import CarRequests from '../../Customers/CarRequests'
import Rentals from '../../Customers/Rentals'

const payments = function (arrToTable) {
    return (
        <table className='table table-hover table-bordered m-y-1'>
            <thead>
                <tr>
                    <th>Amount</th>
                    <th>Code Name</th>
                    <th>Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {arrToTable.map((elem) => {
                    let { amount, codeName,  date, status} = elem
                    return (
                        <tr key={Math.random()}>
                            <td>{amount}</td>
                            <td>{codeName}</td>
                            <td>{date}</td>
                            <td>{status}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
const contracts = function (arrToTable) {
    return (
        <table className='table table-hover table-bordered m-y-1'>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Code Name</th>
                </tr>
            </thead>
            <tbody>
                {arrToTable.map((elem) => {
                    let { title, startDate, endDate, status, codeName } = elem
                    return (
                        <tr key={Math.random()}>
                            <td>{title}</td>
                            <td>{startDate}</td>
                            <td>{endDate}</td>
                            <td>{status}</td>
                            <td>{codeName}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
const invoices = function (arrToTable) {
    return (
        <table className='table table-hover table-bordered m-y-1'>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Due Date</th>
                    <th>Code Name</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {arrToTable.map((elem) => {
                    let { date, dueDate, codeName, status } = elem
                    return (
                        <tr key={Math.random()}>
                            <td>{date}</td>
                            <td>{dueDate}</td>
                            <td>{codeName}</td>                            
                            <td>{status}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

class TableForUser extends React.Component {
    constructor (props) {
        super(props)
        this.state = {arrToTable: props.arrToTable || [], tableTarget: props.params.tableTarget}
    }
    componentWillReceiveProps(nextProps){
        this.setState({arrToTable: nextProps.arrToTable, tableTarget: nextProps.params.tableTarget})
    }
    render () {
        let arrToTable = [],
            currentArray = []
        switch (this.state.tableTarget) {
            case 'payments':
                return (
                    <div>
                        <h4>{this.props.tableName}</h4>
                        {payments(this.state.arrToTable)}
                    </div>
                )
            case 'contracts':
                return (
                    <div>
                        <h4>{this.props.tableName}</h4>
                        {contracts(this.state.arrToTable)}
                    </div>
                )
            case 'invoices':
                return (
                    <div>
                        <h4>{this.props.tableName}</h4>
                        {invoices(this.state.arrToTable)}
                    </div>
                )
            case 'rental_history':
                currentArray = (this.state.arrToTable.profile) ? this.state.arrToTable.profile.rentals : []
                currentArray.forEach(id => {
                    let finder = ApiRentals.findOne({_id: new Mongo.ObjectID(id._str)})
                    if(finder !== undefined){
                        arrToTable.push(finder)   
                    }                    
                })
                return (
                    <div>
                        <h4>{this.props.tableName}</h4>
                        <Rentals rentals={arrToTable} />
                    </div>
                )
            case 'car_requests':
                arrToTable = (this.state.arrToTable.profile) ? this.state.arrToTable.profile.carRequest : []
                return (
                    <div className='p-a-1'>
                        <h4>Car Requests</h4>
                        <CarRequests arrToTable={arrToTable} customerId={Meteor.userId()} />
                    </div>
                )
            default:
                return(
                    <div>
                        <h4>No results</h4>
                    </div>
                )
        }        
    }
}

export default createContainer (({params}) => {
    let { tableTarget } = params,
        loginId = Meteor.userId()
    if(!tableTarget || !loginId) {
        return {
            arrToTable: []
        }
    }
    if(tableTarget && loginId) {
        Meteor.subscribe(tableTarget)
        Meteor.subscribe('rentals')
        switch (tableTarget) {
            case 'payments':
                return {
                    arrToTable: ApiPayments.find({customerId: loginId}).fetch(),
                    tableName: 'Payments'
                }
            case 'contracts':
                return {
                    arrToTable: ApiContracts.find({customerId: loginId}).fetch(),
                    tableName: 'Contracts'
                }
            case 'invoices':
                return {
                    arrToTable: ApiInvoices.find({customerId: loginId}).fetch(),
                    tableName: 'Invoices'
                }
            case 'car_requests': 
                return {
                    arrToTable: Meteor.users.findOne({_id: loginId})
                }
            case 'rental_history':
                return {
                    arrToTable: Meteor.users.findOne({_id: loginId}),
                    tableName: 'Rental History'
                }
            default:
                return {
                    arrToTable: [],
                    tableName: 'No results'
                }                
        }           
    }
}, TableForUser)
