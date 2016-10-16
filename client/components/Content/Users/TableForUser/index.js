/**
 * Created by watcher on 10/8/16.
 */
import React from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiPayments } from '/imports/api/payments'
import { ApiInvoices } from '/imports/api/invoices'
import { ApiContracts } from '/imports/api/contracts'

class TableForUser extends React.Component {
    constructor (props) {
        super(props)
        this.state = {arrToTable: props.arrToTable || []}
    }
    componentWillReceiveProps(nextProps){
        this.setState({arrToTable: nextProps.arrToTable})
    }
    render () {
        let _stateToTh = (this.state.arrToTable) ? Object.keys(this.state.arrToTable[0] || {}, key => obj[key]) : [];
        return (
            <div>
                <h4>{this.props.tableName}</h4>
                <table className='table table-hover table-bordered m-y-1'>
                    <thead>
                        <tr>
                            {_stateToTh.map(prop => {
                                if(prop != '_id' && prop != '_toedit' && prop !== 'customerId') {
                                    let replaceProp = prop.replace( /([A-Z])/g, (l) => {return ' ' + l.toUpperCase()}  )
                                    replaceProp = replaceProp.charAt(0).toUpperCase() + replaceProp.slice(1)
                                    return (
                                        <th key={Math.random()}>{replaceProp}</th>
                                    )   
                                }                                
                            }) }                            
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.arrToTable.map((elem, i) => {
                            let _stateToTd = Object.keys(this.state.arrToTable[i], key => elem[key])
                            if(elem[_stateToTd[1]].length > 0) {
                                return (
                                    <tr key={Math.random()}>
                                        {_stateToTd.map(val => {
                                            if(typeof elem[val] == 'string' && val != 'customerId') {
                                                return (
                                                    <td key={Math.random()}>
                                                        {elem[val]}
                                                    </td>
                                                )                                                
                                            }                                            
                                        })}
                                    </tr>
                                )                            
                            }
                        })}                        
                    </tbody>
                </table>
            </div>
        )
    }
}

export default createContainer (({params}) => {
    let { tableTarget } = params,
        loginId = Meteor.userId(),
        arrToTable
    if(!tableTarget || !loginId) {
        return {
            arrToTable: []
        }
    }
    if(tableTarget && loginId) {
        Meteor.subscribe(tableTarget)
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
            default:
                return {
                    arrToTable: [],
                    tableName: 'No results'
                }                
        }           
    }
}, TableForUser)
