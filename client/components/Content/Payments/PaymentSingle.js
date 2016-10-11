import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiPayments } from '/imports/api/payments.js'
import { ApiUserList } from '/imports/api/userList.js'
import HeadSingle from './HeadSingle.js';
import { browserHistory } from 'react-router';
import React, { Component } from 'react';
import { clone, cloneDeep, reverse } from 'lodash';

import { paymentStateTypes } from '/imports/startup/typesList.js';


import './paymentStyle.css'


export default class PaymentSingle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payment: clone(this.props.payment),
      dispPayment: clone(this.props.payment),
      isNew: this.props.isNew,
      customerList: this.props.userList,

      editable: this.props.isNew
    }


    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onChangeNotes = this.onChangeNotes.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSendByEmail = this.handleSendByEmail.bind(this);
  }

  onChangeCustomer(value) {
    let newPayment = this.state.dispPayment;
    newPayment.customerId = new Mongo.ObjectID(value);
    this.setState({dispPayment: newPayment});
  }

  onChangeAmount(value) {
    let newPayment = this.state.dispPayment;
    newPayment.amount = value;
    this.setState({dispPayment: newPayment});
  }

  onChangeStatus(value) {
    let newPayment = this.state.dispPayment;
    newPayment.status = value;
    this.setState({dispPayment: newPayment});
  }

  onChangeDate(value) {
    let newPayment = this.state.dispPayment;
    newPayment.date = value;
    this.setState({dispPayment: newPayment});
  }

  onChangeNotes(value) {
    let newPayment = this.state.dispPayment;
    newPayment.notes = value;
    this.setState({dispPayment: newPayment});
  }



  componentWillReceiveProps(nextProps) {
    let c = nextProps.payment;

    if (this.state.payment) {
      if (this.state.editable) {
        c.name = clone(this.state.payment.name);
      }
    }


    if (this.state.editable) {
      c = clone(this.state.payment);
    }

    let dataDispPayment = clone(this.state.dispPayment);

    if (!dataDispPayment) {
      dataDispPayment = clone(nextProps.payment)
    }

    this.setState({
      payment: clone(c),
      dispPayment: dataDispPayment
    });
  }

  handleSave() {
    let newPayment = clone(this.state.dispPayment);


    const id = newPayment._id;
    delete newPayment._id;


    ApiPayments.update(id, {$set: newPayment});

    newPayment_id = id;

    this.setState({payment: newPayment, dispPayment: newPayment, editable: false});
  }

  handleEdit() {
    this.setState({editable: !this.state.editable, dispPayment: clone(this.state.payment)});
  }

  handleDelete() {
    browserHistory.push('/payments');

    ApiPayments.remove(this.state.payment._id);
  }

  handleSendByEmail(){
    console.log('SEND BY EMAIL >>>>')
  }


  componentDidMount() {
    if (this.buttonEdit) {
      this.buttonEdit.disabled = false;
    }
  }


  render() {

    console.log('this.props.userList', this.props.userList)
    console.log('>', this.state.dispPayment)

    const renderHeadSingle = () => {
      return (
        <HeadSingle onSave={this.handleSave}
                    onEdit={this.handleEdit}
                    onDelete={this.handleDelete}
                    onSendByEmail={this.handleSendByEmail} />
      )
    }


    if (this.state.payment) {
      let {
        customerId,
        amount,
        status,
        date,
        notes
      } = this.state.payment;


      const renderTopFields = () => {
        return (
          <div className="topFields">
            <div className="row">
              <div className="form-group profit col-xs-6">
                <label htmlFor="paymentStatus" className='col-xs-2'>Customer Name</label>
                {(() => {
                  if (this.state.editable) {
                    return (
                      <div className='col-xs-8 form-horizontal'>
                        <select className=' form-control' onChange={(e) => this.onChangeCustomer(e.target.value)}>
                          {(() => {
                            if (customerId) 
                              console.log('customerId',customerId._id)
                              return (
                                      undefined
                                // <option className='' value={customerId}>{Meteor.users.findOne(customerId).username}</option>
                              )
                            return undefined;
                          })()}
                          {
                            this.props.userList.map((el, key) => {
                                if (el._id != customerId) {
                                  return (
                                    <option key={key} value={el._id._str}>{el.username}</option>
                                  )
                                }
                                return undefined;
                              }
                            )}
                        </select>
                      </div>
                    )
                  }

                  return <div className='col-xs-8'>{Meteor.users.findOne(customerId).username}</div>
                })()}
              </div>

              <div className="form-group profit col-xs-6">
                <label htmlFor="paymentStatus" className='col-xs-2'>Date</label>
                {(() => {
                  if (this.state.editable) {
                    return (
                      <div className='col-xs-8 form-horizontal'>
                        <input
                          type="date"
                          id="paymentAmount"
                          className="form-control "
                          onChange={(e) => this.onChangeDate(e.target.value)}
                          value={ this.state.dispPayment.date }/>
                      </div>
                    )
                  }

                  return <div className='col-xs-8'>{date}</div>
                })()}
              </div>
            </div>

            <div className="row">
              <div className="form-group profit col-xs-6">
                <label htmlFor="paymentStatus" className='col-xs-2'>Status</label>
                {(() => {
                  if (this.state.editable) {
                    return (
                      <div className='col-xs-8 form-horizontal'>
                        <select className=' form-control' onChange={(e) => this.onChangeStatus(e.target.value)}>
                          <option className='' value={this.state.dispPayment.status}>{this.state.dispPayment.status}</option>
                          {
                            paymentStateTypes.map((el, key) => {
                              if (el !== status) {
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

                  return <div className='col-xs-8'>{status}</div>
                })()}
              </div>
              
              <div className="form-group name col-xs-6">
                <label htmlFor="paymentAmount" className='col-xs-2'>Amount</label>
                {(() => {
                  if (this.state.editable) {
                    return (
                      <div className='col-xs-8 form-horizontal'>
                        <input
                          type="text"
                          id="paymentAmount"
                          className="form-control "
                          onChange={(e) => this.onChangeAmount(e.target.value)}
                          value={ this.state.dispPayment.amount }/>
                      </div>
                    )
                  }

                  return <div className='col-xs-8'>{amount}</div>
                })()}
              </div>
            </div>
          </div>
        )
      }



      const renderTabs = () => {
        return (
          <div className="row">
            <ul className="nav nav-tabs" role="tablist">
              <li className="active">
                <a href="#description" aria-controls="home" role="tab" data-toggle="tab">Notes</a>
              </li>
            </ul>
            <div className="tab-content">
              <div role="tabpanel" className="tab-pane p-x-1 active" id="notes">
                {(() => {
                  if (this.state.editable) {
                    return (
                      <textarea
                        className='form-control'
                        onChange={(e) => this.onChangeNotes(e.target.value)}
                        value={this.state.dispPayment.notes}>
                      </textarea>
                    )
                  }

                  return <textarea className="form-control" rows="3" disabled value={notes}></textarea>
                })()}
              </div>
            </div>
          </div>
        )
      }


      return (
        <div className="PaymentSingle panel panel-default">

          { renderHeadSingle() }
          <div className='panel-body'>
            { renderTopFields() }

            { renderTabs() }
          </div>

        </div>
      )
    } else {
      return (<div className="PaymentSingle"></div>)
    }
  }
}


export default createContainer(({params}) => {
  Meteor.subscribe('payments');
  Meteor.subscribe("userList");

  let isNew = false;
  let paymentId = params.paymentId;

  if (params.paymentId.indexOf('new') === 0) {
    isNew = true;
    paymentId = params.paymentId.substring(3);
    window.history.pushState('object or string', 'Title', `/payments/${paymentId}`);
    // window.history.back();
  }


  const idForQuery = new Mongo.ObjectID(paymentId);

  if (!idForQuery) {
    browserHistory.push('/payments');
  }

  return {
    payment: ApiPayments.findOne(idForQuery),
    userList: Meteor.users.find().fetch(),
    isNew: isNew
  }

}, PaymentSingle)
