/**
 * Created by watcher on 10/19/16.
 */
import React from 'react'
import { Link } from 'react-router'
import NumericInput from 'react-numeric-input'

const DatePicker = require('react-bootstrap-date-picker')

class PaymentsRow extends React.Component {
    constructor(props){
        super(props)
        this.state = {payment: props.payment || {}}
        this.handlerEditor = this.handlerEditor.bind(this)
    }
    componentWillReceiveProps (nextProps) {
        this.setState({payment: nextProps.payment})
    }
    handlerEditor(e) {
        const id = this.props.payment._id._str, 
            objToSend = {
                amount: this.rEditFieldAmount.state.value,
                customerId: this.props.payment.customerId,
                codeName: this.rEditFieldCodeName.value,
                date: this.rEditFieldDate.state.value.slice(0, 10),
                status: this.rEditFieldStatus.value
            }
        //ApiFines.update({_id: new Mongo.ObjectID(data.id)}, {$set: data.objToSend})
        this.props.handlerButtons(e, {id, objToSend})
        objToSend._id = new Mongo.ObjectID(id)
        this.setState({payment: objToSend})
    }
    render () {
        let { _id, _toedit, amount, codeName, date, status } = this.state.payment
        let href = (_id) ? '/managePanel/payments/' + _id._str : '/managePanel/payments/'
        let selectOpen = (status == 'open') ? true : false //not use defaultValue instead selected because defaultValue not boolean value
        let selectClose = (status == 'close') ? true : false //not use defaultValue instead selected because defaultValue not boolean value
        if(_toedit) {
            return (
                <tr>
                    <td className=''>
                        <img className='pull-right img-save' src='/img/save.png' width='24' name='save-note' onClick={this.handlerEditor} />
                    </td>
                    <td><Link to={href}>{_id._str}</Link></td>
                    <td><input type='text' name='codeName' className='form-control' defaultValue={codeName} ref={ref => {this.rEditFieldCodeName = ref}} /></td>
                    <td><NumericInput name='amount' className='form-control' value={amount} ref={ref => {this.rEditFieldAmount = ref}} /></td>
                    <td><DatePicker dateFormat='MM/DD/YYYY' value={date} ref={ref => {this.rEditFieldDate = ref}} /></td>
                    <td width='100'>
                        <select name='status' className='form-control' ref={ref => {this.rEditFieldStatus = ref}}>
                            <option value='open' selected={selectOpen}>Open</option>
                            <option value='close' selected={selectClose}>Close</option>
                        </select>
                    </td>                                        
                </tr>
            )
        } else {
            return (
                <tr>
                    <td>{(_id) ? <input type='checkbox' onChange={(e) => {this.props.handlerChecker(e, _id._str)}} /> : ''}</td>
                    <td>{_id._str}</td>
                    <td>{codeName}</td>
                    <td>{amount}</td>
                    <td>{date}</td>
                    <td>{status}</td>                    
                </tr>
            )   
        }        
    }
}

export default PaymentsRow