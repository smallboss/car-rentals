import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data'
import { ApiPayments } from '/imports/api/payments.js'
import { ApiUsers } from '/imports/api/users'
import { ApiYearWrite } from '/imports/api/yearWrite'
import { ApiInvoices } from '/imports/api/invoices'
import HeadSingle from './HeadSingle.js';
import { browserHistory } from 'react-router';
import React, { Component } from 'react';
import { clone, cloneDeep, reverse } from 'lodash';

import { paymentStateTypes } from '/imports/startup/typesList.js';

import './paymentStyle.css'
import '/client/main.css'


export default class PaymentSingle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payment: clone(this.props.payment),
      dispPayment: clone(this.props.payment),
      allowSave: false,
      isNew: this.props.isNew,
      customerList: this.props.userList,

      editable: this.props.isNew
    }


    this.onChangeCustomer = this.onChangeCustomer.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onChangeNotes = this.onChangeNotes.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeRef = this.onChangeRef.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSendByEmail = this.handleSendByEmail.bind(this);
  }

// ====================== ON CHANGE ======================
  onChangeCustomer(value) {
    let newPayment = this.state.dispPayment;
    newPayment.customerId = value;
    this.setState({dispPayment: newPayment, allowSave: true});
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
  onChangeRef(value) {
    let newPayment = this.state.dispPayment;
    newPayment.ref = value;
    this.setState({dispPayment: newPayment});
  }
  onChangeDate(value) {
    let newPayment = this.state.dispPayment;
    newPayment.date = value;
    this.setState({dispPayment: newPayment});
  }
  onChangeRef(value) {
    let newPayment = this.state.dispPayment;
    newPayment.ref = value;
    this.setState({dispPayment: newPayment});
  }
  onChangeNotes(value) {
    let newPayment = this.state.dispPayment;
    newPayment.notes = value;
    this.setState({dispPayment: newPayment});
  }
// END ================== ON CHANGE ======================

  componentWillReceiveProps(nextProps) {
    let c = nextProps.payment;


    if (this.state.editable) {
      c = clone(this.state.payment);
    }

    let dataDispPayment = clone(this.state.dispPayment);

    if (!dataDispPayment) {
      dataDispPayment = clone(nextProps.payment)
    }

    const allowSave = this.state.editable ? this.state.allowSave : c.customerId;

    c = nextProps.payment;

    this.setState({
      payment: clone(c),
      dispPayment: dataDispPayment,
      allowSave
    });
  }

  handleSave() {
    let newPayment = clone(this.state.dispPayment);
    let paymentId;

    if(this.state.isNew){
      paymentId = new Mongo.ObjectID();
      newPayment._id = paymentId;
      ApiPayments.insert(newPayment);

      let yearWrite = ApiYearWrite.findOne({year: '2016'});
      let paymentsNumb = '1';

      if (yearWrite) {
        if(!yearWrite.paymentsNumb) yearWrite.paymentsNumb = '0';
        yearWrite.paymentsNumb = ''+(parseInt(yearWrite.paymentsNumb)+1);
        paymentsNumb = parseInt(yearWrite.paymentsNumb);
      } else {
        yearWrite = {
            _id: new Mongo.ObjectID(),
            paymentsNumb: paymentsNumb
        };
        
        ApiYearWrite.insert({
            _id: yearWrite._id, 
            year: ''+(new Date()).getFullYear()
        });
      }

      if (yearWrite.paymentsNumb.length == 1)
        paymentsNumb = '00'+paymentsNumb;
      else if (yearWrite.paymentsNumb.length <= 2)
          paymentsNumb = '0'+paymentsNumb;
          else paymentsNumb = ''+paymentsNumb;

      let codeName = `PAY/${(new Date()).getFullYear()}/${paymentsNumb}`;

      ApiPayments.update(paymentId, {$set: { codeName }});

      paymentsNumb = ''+parseInt(paymentsNumb);
      ApiYearWrite.update({_id: yearWrite._id }, {$set: { paymentsNumb }});
    } else {
      paymentId = newPayment._id;
      delete newPayment._id;
      ApiPayments.update(paymentId, {$set: newPayment});
      if (newPayment.customerId != this.state.payment.customerId) {
        Meteor.users.update({_id: this.state.payment.customerId}, {$pull: { "profile.payments": paymentId}});        
      }
    }

    Meteor.users.update({_id: newPayment.customerId}, {$addToSet: { "profile.payments": paymentId}});
    if (this.state.isNew) browserHistory.push(`/payments/${paymentId}`);
    this.setState({payment: newPayment, dispPayment: newPayment, editable: false, isNew: false});
  }

  handleEdit() {
    this.setState({
        editable: !this.state.editable,
        dispPayment: clone(this.state.payment),
        allowSave: this.state.payment.customerId
    });
  }

  handleDelete() {
    browserHistory.push('/payments');

    const invoice = ApiInvoices.findOne({paymentsId: this.state.payment._id});
    
    if (invoice) ApiInvoices.update({_id: invoice._id}, {$pull: { paymentsId: this.state.payment._id}});

    Meteor.users.update({_id: this.state.payment.customerId}, {$pull: { "profile.payments": this.state.payment._id}});
    ApiPayments.remove(this.state.payment._id);
  }

  handleSendByEmail(){
    console.log('SEND BY EMAIL >>>>')
  }


  componentDidMount() {
    if (this.buttonEdit) {
      this.buttonEdit.disabled = false;
    }

    const allowSave = this.props.payment ? this.props.payment.customerId : undefined;
    this.setState({allowSave});
  }


  render() {

    const renderHeadSingle = () => {
      return (
        <HeadSingle onSave={this.handleSave}
                    onEdit={this.handleEdit}
                    onDelete={this.handleDelete}
                    onSendByEmail={this.handleSendByEmail}
                    allowSave={this.state.allowSave}
                    title={this.props.payment.codeName} />
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
{ /* ============================== DROPDOWN CUSTOMERS ============================== */}
              <div className="form-group profit col-xs-6">
                <label htmlFor="paymentCustomerName" className='col-xs-3'>Customer Name</label>
                {(() => {
                  if (this.state.editable) {
                    return (
                      <div className='col-xs-8 form-horizontal'>
                        <select className=' form-control' onChange={(e) => this.onChangeCustomer(e.target.value)}>
                          {(() => {
                            const {username, profile} = customerId ? Meteor.users.findOne(customerId)  : '';
                            const userProfileName = customerId ? (profile.name + ' : ' + username) : '';
                              
                            return (    
                              <option 
                                className='' 
                                value={customerId}>{ userProfileName }
                              </option>
                            )

                          })()}
                          {
                            this.props.userList.map((el, key) => {
                                const currentId = customerId ? customerId : '';
                                if (el._id != currentId) {
                                  return (
                                    <option 
                                      key={key} 
                                      value={el._id}>{(el.profile.name ? (el.profile.name + " : ") : '') + el.username}</option>
                                  )
                                }
                                return undefined;
                              }
                            )}
                        </select>
                      </div>
                    )
                  }

                  return (
                    <div className='col-xs-8 m-t-05'>
                      {(() => {
                        if (Meteor.users.findOne(customerId)) {
                          const profile = Meteor.users.findOne(customerId).profile;
                          return (profile.name ? (profile.name + ' : ') : '' ) + Meteor.users.findOne(customerId).username
                        }
                        return undefined;
                      })()}
                    </div>
                  )
                })()}
              </div>
{ /* END ============================= DROPDOWN CUSTOMERS ============================== */}

              <div className="form-group profit col-xs-6">
                <label htmlFor="paymentDate" className='col-xs-3'>Date</label>
                {(() => {
                  if (this.state.editable) {
                    return (
                      <div className='col-xs-8 form-horizontal'>
                        <input
                          type="date"
                          id="paymentDate"
                          className="form-control "
                          onChange={(e) => this.onChangeDate(e.target.value)}
                          value={ this.state.dispPayment.date }/>
                      </div>
                    )
                  }

                  return <div className='col-xs-8 m-t-05'>{date}</div>
                })()}
              </div>
            </div>

            <div className="row">
              <div className="form-group profit col-xs-6">
                <label htmlFor="paymentStatus" className='col-xs-3'>Status</label>
                {(() => {
                  if (this.state.editable) {
                    return (
                      <div className='col-xs-8 form-horizontal'>
                        <select className=' form-control' onChange={(e) => this.onChangeStatus(e.target.value)}>
                          <option className='' value={this.state.dispPayment.status}>{this.state.dispPayment.status}</option>
                          {
                            paymentStateTypes.map((el, key) => {
                              if (el != this.state.dispPayment.status) {
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

                  return <div className='col-xs-8 m-t-05'>{status}</div>
                })()}
              </div>
              
              <div className="form-group name col-xs-6">
                <label htmlFor="paymentAmount" className='col-xs-3'>Amount</label>
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

                  return <div className='col-xs-8 m-t-05'>{amount}</div>
                })()}
              </div>
            </div>
            <div className="row">
              <div className="form-group profit col-xs-6">
                <label htmlFor="paymentRef" className='col-xs-3'>Ref.</label>
                {(() => {
                  const custId = this.state.editable ? this.state.dispPayment.customerId : customerId;
                  const custName = Meteor.users.findOne(custId) ? (Meteor.users.findOne(custId).profile.name + " profile") : '';

                  return (<Link to={`/managePanel/customer/${custId}`} className="col-xs-12">{custName}</Link>);
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
  Meteor.subscribe('invoices');
  Meteor.subscribe('users');
  Meteor.subscribe('yearwrite');

  let isNew = false;
  let paymentId = params.paymentId;
  let payment = {};

  if (params.paymentId.indexOf('new') === 0) {
    isNew = true;
  } else {
    payment = ApiPayments.findOne(new Mongo.ObjectID(paymentId));
  }

  return {
    payment,
    userList: Meteor.users.find({'profile.userType': 'customer'}).fetch(),
    isNew
  }

}, PaymentSingle)
