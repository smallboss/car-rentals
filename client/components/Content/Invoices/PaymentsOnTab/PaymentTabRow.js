import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-bootstrap-date-picker'
import { map, find, clone } from 'lodash';
import { Link } from 'react-router';

import { paymentStateTypes } from '/imports/startup/typesList.js';

export default class PaymentTabRow extends Component {
    constructor(props) {
        super(props); 

        this.state = {
            dispPayment: this.props.payment,
            isEdit: false
        }

        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeAmount = this.onChangeAmount.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
    } 


    componentWillReceiveProps(nextProps){
        let dispPayment = nextProps.payment;

        const nextPayment = nextProps.payment ? nextProps.payment._id._str : '';
        const isSelected = find(nextProps.selectedListId, {_str: nextPayment});
        
        if (!this.props.readOnly) 
            this.checkbox.checked = isSelected;

        const isEdit = (isSelected && nextProps.isEdit) ? true : false;

        this.setState({dispPayment, isEdit});
    }

    componentDidMount() {
        let dispPayment = this.props.payment;

        const nextPayment =  this.props.payment ?  this.props.payment._id._str : '';
        const isSelected = find( this.props.selectedListId, {_str: nextPayment});

        if (this.checkbox)
            this.checkbox.checked = isSelected;

        const isEdit = (isSelected &&  this.props.isEdit) ? true : false;

        this.setState({dispPayment, isEdit});
    }

// ==================== CHANGERS FIELDS =============================
    onChangeDate(value){
        let newPayment = this.state.dispPayment;
        newPayment.date = value.slice(0, 10);
        this.setState({dispPayment: newPayment});
    }
    onChangeAmount(value){
        let newPayment = this.state.dispPayment;
        value = (value!='' && isNaN(parseInt(value))) ? '0' : value;
        let isDepr = false;

        isDepr = ((parseInt(value) < 0) || 
                  (value.includes('e')) || 
                  (value.includes('E')) ||  
                  (value.length > 10));

        value = isNaN(parseInt(value)) ? '0' : value+'';

        newPayment.amount = isDepr ?  newPayment.amount : value;
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
            const paymentCodeName = payment ? payment.codeName : '';
            const paymentIdStr = payment ? payment._id._str : '';
            return (<Link to={`/managePanel/payments/${paymentIdStr}`}>{paymentCodeName}</Link>)
        }


        const showDate = () => {
            if (this.state.isEdit){
                return(
                    <DatePicker value={dispPayment.date}
                                onChange={ this.onChangeDate } />
                )
            }

            return <span>{payment ? payment.date : ''}</span>
        }

        const showAmount = () => {
            if (this.state.isEdit){
                return(
                    <input  type="number"
                            min="0"
                            max="99999"
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
                            <th className="noPrint">
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