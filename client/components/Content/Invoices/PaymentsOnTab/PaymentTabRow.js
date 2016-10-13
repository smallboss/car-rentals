import React, { Component, PropTypes } from 'react';
import { map, find } from 'lodash';
import { Link } from 'react-router';

import { paymentStateTypes } from '/imports/startup/typesList.js';

export default class PaymentTabRow extends Component {
    constructor(props) {
        super(props); 

        this.state = {
            dispPayment: this.props.payment,
            isEdit: this.props.isEdit
        }

        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeAmount = this.onChangeAmount.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
    } 


    componentWillReceiveProps(nextProps){
        let dispPayment = (!this.state.dispPayment)
                                    ? nextProps.payment 
                                    : this.state.dispPayment

        const nextPayment = nextProps.payment ? nextProps.payment._id._str : '';
        const isSelected = find(nextProps.selectedListId, {_str: nextPayment});
        
        if (!this.props.readOnly) 
            this.checkbox.checked = isSelected;

        const isEdit = (isSelected && nextProps.isEdit) ? true : false;

        this.setState({dispPayment, isEdit});
    }

// ==================== CHANGERS FIELDS =============================
    onChangeDate(value){
        let newPayment = this.state.dispPayment;
        newPayment.date = value;
        this.setState({dispPayment: newPayment});
    }
    onChangeAmount(value){
        let newPayment = this.state.dispPayment;
        newPayment.amount = value;
        this.setState({dispPayment: newPayment});
    }
    onChangeStatus(value){
        let newPayment = this.state.dispPayment;
        newPayment.status = value;
        this.setState({dispPayment: newPayment});
    }
// END ================ CHANGERS FIELDS =============================


    render(){
        const payment = this.props.payment;
        let dispPayment = this.state.dispPayment;

        const buttonSave = () => {
            if (this.state.isEdit) {
                return (
                    <button
                        onClick={() => this.props.onSave(this.state.dispPayment)}
                        className='btn btn-danger'>
                        Save
                    </button>
                )
            }

            return undefined;
        }

        const showPaymentId = () => {
            const paymentIdStr = payment ? payment._id._str : '';
            return (<Link to={`/payments/${paymentIdStr}`}>{paymentIdStr}</Link>)
        }


        const showDate = () => {
            if (this.state.isEdit){
                return(
                    <input  type="date"
                            value={dispPayment.date}
                            onChange={(e) => this.onChangeDate(e.target.value)} />
                )
            }

            return <span>{payment ? payment.date : ''}</span>
        }

        const showAmount = () => {
            if (this.state.isEdit){
                return(
                    <input  type="text"
                            value={dispPayment.amount}
                            onChange={(e) => this.onChangeAmount(e.target.value)} />
                )
            }

            return <span>{payment ? payment.amount : ''}</span>
        }

        const showStatus = () => {
            if (this.state.isEdit) {
                return (
                  <div className='col-xs-8 form-horizontal'>
                    <select className=' form-control' onChange={(e) => this.onChangeStatus(e.target.value)}>
                      <option className='' value={this.state.dispPayment.status}>{this.state.dispPayment.status}</option>
                      {
                        paymentStateTypes.map((el, key) => {
                          if (el !== this.state.dispPayment.status) {
                              return (
                                <option key={key} value={el}>{el}</option>
                              )
                            }
                            return undefined;
                          }
                        )}
                    </select>
                  </div>
                )
            }

            return <span>{payment ? payment.status : ''}</span>
        }

        return(
            <tr className="PaymentTabRow">
                {(() => {
                    if (!this.props.readOnly) {
                        return (
                            <th>
                                <input  type="checkbox" 
                                        onChange={() => this.props.onSelect(payment._id)}
                                        ref={(ref) => this.checkbox = ref}/>
                            </th>
                        )
                    }

                    return null;
                })()}
                <td>
                    { buttonSave() }
                    { showPaymentId() }
                </td>
                <td>{ showDate() }</td>
                <td>{ showAmount() }</td>
                <td>{ showStatus() }</td>
            </tr>
        )
    }
}