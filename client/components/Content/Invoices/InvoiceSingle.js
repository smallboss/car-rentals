import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { Link } from 'react-router';
import { Email } from 'meteor/email'
import { createContainer } from 'meteor/react-meteor-data'
import DatePicker from 'react-bootstrap-date-picker'
import { ApiInvoices } from '/imports/api/invoices.js'
import { ApiPayments } from '/imports/api/payments.js'
import { ApiLines } from '/imports/api/lines.js'
import { ApiContracts } from '/imports/api/contracts'
import { ApiUsers } from '/imports/api/users'
import { ApiYearWrite } from '/imports/api/yearWrite'
import HeadSingle from './HeadSingle.js';
import { browserHistory } from 'react-router';
import React, { Component } from 'react';
import { clone, cloneDeep, reverse, find, map } from 'lodash';
import { getInvoiceMsg } from '/client/helpers/generatorTextMessages.js'

import PaymentsOnTab from './PaymentsOnTab/PaymentsOnTab.js'
import LinesOnTab from './LinesOnTab/LinesOnTab.js'

import { invoiceStateTypes } from '/imports/startup/typesList.js';

import './invoiceStyle.css'
import '/client/main.css'


export default class InvoiceSingle extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      loginLevel: context.loginLevel,
      invoice: clone(this.props.invoice),
      dispInvoice: clone(this.props.invoice),
      allowSave: false,
      isNew: this.props.isNew,
      customerList: this.props.userList,

      editable: this.props.isNew
    }

    this.onChangeCustomer = this.onChangeCustomer.bind(this);
    this.onChangeNotes = this.onChangeNotes.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeDueDate = this.onChangeDueDate.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handlePrint = this.handlePrint.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSendByEmail = this.handleSendByEmail.bind(this);
  }

// ====================== ON CHANGE ======================
  onChangeCustomer(value) {
    let newInvoice = this.state.dispInvoice;
    newInvoice.customerId = value;
    const allowSave = this.state.dispInvoice.customerId ? true : false;
    this.setState({ 
        dispInvoice: newInvoice, 
        allowSave: this.state.dispInvoice.customerId 
    });
  }
  onChangeStatus(value) {
    let newInvoice = this.state.dispInvoice;
    newInvoice.status = value;
    this.setState({dispInvoice: newInvoice});
  }
  onChangeDate(value) {
    let newInvoice = this.state.dispInvoice;
    newInvoice.date = value.slice(0, 10);
    this.setState({dispInvoice: newInvoice});
  }
  onChangeDueDate(value) {
    let newInvoice = this.state.dispInvoice;
    newInvoice.dueDate = value.slice(0, 10);
    this.setState({dispInvoice: newInvoice});
  }
  onChangeNotes(value) {
    let newInvoice = this.state.dispInvoice;
    newInvoice.notes = value;
    this.setState({dispInvoice: newInvoice});
  }
// END ================== ON CHANGE ======================

  componentWillReceiveProps(nextProps, nextContext) {
    let c = nextProps.invoice;


    if (this.state.editable) {
      c = clone(this.state.invoice);
    }

    let dataDispInvoice = clone(this.state.dispInvoice);

    if (!dataDispInvoice) {
      dataDispInvoice = clone(nextProps.invoice)
    }
    
    const allowSave = this.state.editable 
                            ? this.state.allowSave 
                            : ( c ? c.customerId : false);

    c = nextProps.invoice;

    this.setState({
      invoice: clone(c),
      dispInvoice: dataDispInvoice,
      allowSave,
      loginLevel: nextContext.loginLevel
    });
  }

  handlePrint(){
    console.log('PRINT >>>');
  }


  handleSave() {
    let newInvoice = clone(this.state.dispInvoice);
    let invoiceId;


    if(this.state.isNew){
      invoiceId = new Mongo.ObjectID();
      newInvoice._id = invoiceId;
      if (this.props.contract) newInvoice.contractId = this.props.contract._id;
      ApiInvoices.insert(newInvoice);

      let yearWrite = ApiYearWrite.findOne({year: '2016'});
      let invoicesNumb = '1';
/////
      if (yearWrite) {
        if(!yearWrite.invoicesNumb) yearWrite.invoicesNumb = '0';
        yearWrite.invoicesNumb = ''+(parseInt(yearWrite.invoicesNumb)+1);
        invoicesNumb = parseInt(yearWrite.invoicesNumb);
      } else {
        yearWrite = {
            _id: new Mongo.ObjectID(),
            invoicesNumb: invoicesNumb
        };
        
        ApiYearWrite.insert({
            _id: yearWrite._id, 
            year: ''+(new Date()).getFullYear()
        });
      }

      if (yearWrite.invoicesNumb.length == 1)
        invoicesNumb = '00'+invoicesNumb;
      else if (yearWrite.invoicesNumb.length <= 2)
          invoicesNumb = '0'+invoicesNumb;
          else invoicesNumb = ''+invoicesNumb;

      let codeName = `INV/${(new Date()).getFullYear()}/${invoicesNumb}`;

      ApiInvoices.update(invoiceId, {$set: { codeName }});

      map(newInvoice.paymentsId, (el) => {
        Meteor.users.update({_id: this.state.invoice.customerId}, {$pull: { "profile.payments": el}});
        ApiPayments.update({_id: el}, {$set: {customerId: newInvoice.customerId}});
        Meteor.users.update({_id: newInvoice.customerId}, {$addToSet: { "profile.payments": el}});
      })

      invoicesNumb = ''+parseInt(invoicesNumb);
      ApiYearWrite.update({_id: yearWrite._id }, {$set: { invoicesNumb }});
    } else {
      invoiceId = newInvoice._id;
      delete newInvoice._id;
      ApiInvoices.update(invoiceId, {$set: newInvoice});

      if (newInvoice.paymentsId) {
        map(newInvoice.paymentsId, (el) => {
          Meteor.users.update({_id: this.state.invoice.customerId}, {$pull: { "profile.payments": el}});
          ApiPayments.update({_id: el}, {$set: {customerId: newInvoice.customerId}});
          Meteor.users.update({_id: newInvoice.customerId}, {$addToSet: { "profile.payments": el}});
        })
      }
    }


    if (this.props.contract) {
      ApiContracts.update({_id: this.props.contract._id}, {$addToSet: {invoicesId: invoiceId}});
    }
    if (this.state.oldCustomerId != this.state.invoice.customerId) {
      Meteor.users.update({_id: this.state.oldCustomerId}, {$pull: { "profile.invoices": contractId}});
    }
    Meteor.users.update({_id: newInvoice.customerId}, {$addToSet: { "profile.invoices": invoiceId}});
    if (this.state.isNew) browserHistory.push(`/managePanel/invoices/${invoiceId}`);
    this.setState({invoice: newInvoice, dispInvoice: newInvoice, editable: false, isNew: false});
  }

  handleEdit() {
    this.setState({
        editable: !this.state.editable, 
        dispInvoice: clone(this.state.invoice), 
        allowSave: this.state.invoice.customerId
    });
  }

  handleDelete() {
    browserHistory.push('/managePanel/invoices');

    map(this.state.invoice.paymentsId, (el) => {
      const payment = ApiPayments.findOne({_id: el});
      Meteor.users.update({_id: payment.customerId}, {$pull: { "profile.payments": el}});
      ApiPayments.remove({_id: el});
    })

    map(this.state.invoice.linesId, (el) => {
      ApiLines.remove({_id: el});
    })


    ApiContracts.update({_id: this.state.invoice.contractId}, {$pull: { "profile.invoicesId": this.state.invoice._id}});
    Meteor.users.update({_id: this.state.invoice.customerId}, {$pull: { "profile.invoices": this.state.invoice._id}});
    ApiInvoices.remove(this.state.invoice._id);
  }

  handleSendByEmail(){
    let email = find(this.props.managerList, ['_id', Meteor.userId()]);
    email = email 
              ? email.emails[0] 
              : find(this.props.customerList, ['_id', Meteor.userId()]).emails[0];

    Meteor.call('sendEmail',
            email.address,
            'smallboss@live.ru',
            'Invoice ' + this.state.invoice.codeName,
            getInvoiceMsg(this.state.invoice._id));
  }


  componentDidMount() {
    if (this.buttonEdit) {
      this.buttonEdit.disabled = false;
    }

    const allowSave = this.props.invoice ? this.props.invoice.customerId : undefined;
    this.setState({allowSave});
  }


  render() {
    
    const renderHeadSingle = () => {
      return (
        <HeadSingle onSave={this.handleSave}
                    onPrint={this.handlePrint}
                    onEdit={this.handleEdit}
                    onDelete={this.handleDelete}
                    onSendByEmail={this.handleSendByEmail}
                    allowSave={this.state.allowSave}
                    title={this.props.invoice.codeName}
                    loginLevel={this.state.loginLevel} />
      )
    }

    if (this.state.invoice) {
      let {
        customerId,
        date,
        dueDate,
        status,
        notes
      } = this.state.invoice;


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
                {(() => {
                  const custId = this.state.editable ? this.state.dispInvoice.customerId : customerId;
                  const custName = Meteor.users.findOne(custId) ? (Meteor.users.findOne(custId).profile.name + ' profile') : '';

                  return (<Link to={`/managePanel/customer/${custId}`} className="col-xs-12">{custName}</Link>);
                })()}
              </div>
              { /* END ============================= DROPDOWN CUSTOMERS ============================== */}
              <div className="form-group name col-xs-6">
                <label htmlFor="invoiceDate" className='col-xs-3'>Invoice date</label>
                {(() => {
                  if (this.state.editable) {
                    return (
                      <div className='col-xs-8 form-horizontal'>
                        <DatePicker value={this.state.dispInvoice.date} onChange={this.onChangeDate} />
                      </div>
                    )
                  }

                  return <div className='col-xs-8 m-t-05'>{date}</div>
                })()}
              </div>
            </div>

            <div className="row">
              <div className="form-group profit col-xs-6">
                <label htmlFor="invoiceStatus" className='col-xs-3'>Status</label>
                {(() => {
                  if (this.state.editable) {
                    return (
                      <div className='col-xs-8 form-horizontal'>
                        <select className=' form-control' onChange={(e) => this.onChangeStatus(e.target.value)}>
                          <option className='' value={this.state.dispInvoice.status}>{this.state.dispInvoice.status}</option>
                          {
                            invoiceStateTypes.map((el, key) => {
                              if (el != this.state.dispInvoice.status) {
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
                <label htmlFor="invoiceDueDate" className='col-xs-3'>Invoice Due date</label>
                {(() => {
                  if (this.state.editable) {
                    return (
                      <div className='col-xs-8 form-horizontal'>
                        <DatePicker value={this.state.dispInvoice.dueDate} onChange={this.onChangeDueDate} />
                      </div>
                    )
                  }

                  return <div className='col-xs-8 m-t-05'>{dueDate}</div>
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
                <a href="#lines" aria-controls="home" role="tab" data-toggle="tab">Lines</a>
              </li>
              <li><a href="#payments" aria-controls="messages" role="tab" data-toggle="tab">Payments</a></li>
              <li><a href="#notes" aria-controls="messages" role="tab" data-toggle="tab">Notes</a></li>
            </ul>
            <div className="tab-content">
            {
              <div role="tabpanel" className="tab-pane p-x-1 active" id="lines">
              
                <LinesOnTab 
                    invoice={cloneDeep(this.state.invoice)}
                    linesId={cloneDeep(this.state.invoice.linesId 
                                        ? this.state.invoice.linesId 
                                        : [])
                            }
                    readOnly={!this.state.invoice.customerId} />

                <div className="PaymentsOnTab row">
                  <div className="col-xs-12">
                    <h3>Payments list</h3>
                    <PaymentsOnTab 
                            invoice={cloneDeep(this.state.invoice)}
                            paymentsId={this.state.invoice.paymentsId}
                            readOnly={true} />
                  </div>
                </div>  
              </div>
              }
              <div role="tabpanel" className="tab-pane p-x-1" id="payments">
                <PaymentsOnTab 
                    invoice={cloneDeep(this.state.invoice)}
                    paymentsId={clone(this.state.invoice.paymentsId 
                                        ? this.state.invoice.paymentsId 
                                        : []).reverse()}
                    readOnly={!this.state.invoice.customerId}/>
              </div>
              <div role="tabpanel" className="tab-pane p-x-1" id="notes">
                {(() => {
                  if (this.state.editable) {
                    return (
                      <textarea
                        className='form-control'
                        onChange={(e) => this.onChangeNotes(e.target.value)}
                        value={this.state.dispInvoice.notes}>
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
        <div className="InvoiceSingle panel panel-default">
          { renderHeadSingle() }
          <div className='panel-body'>
            { renderTopFields() }

            { renderTabs() }
          </div>
        </div>
      )
    } else {
      return (<div className="InvoiceSingle"></div>)
    }
  }
}


InvoiceSingle.contextTypes = {
  loginLevel: React.PropTypes.number.isRequired
}

export default createContainer(({params}) => {
  Meteor.subscribe('invoices');
  Meteor.subscribe('users');
  Meteor.subscribe('yearwrite');
  Meteor.subscribe('contracts');
  Meteor.subscribe('lines');


  let isNew = false;
  let invoiceId = params.invoiceId;
  let invoice = {};
  let contract;

  if (params.invoiceId.indexOf('new') === 0) {
    isNew = true;
    if (params.invoiceId.substr(3)) {
      contract = ApiContracts.findOne(new Mongo.ObjectID(params.invoiceId.substr(3)));
    }
  } else {
    invoice = ApiInvoices.findOne(new Mongo.ObjectID(invoiceId));
  }

  return {
    invoice,
    userList: Meteor.users.find({'profile.userType': 'customer'}).fetch(),
    managerList: Meteor.users.find({'profile.userType': {$in:["admin","employee"]}}).fetch(),
    contract,
    isNew
  }

}, InvoiceSingle)
