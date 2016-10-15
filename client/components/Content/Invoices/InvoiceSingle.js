import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data'
import { ApiInvoices } from '/imports/api/invoices.js'
import { ApiPayments } from '/imports/api/payments.js'
import { ApiUsers } from '/imports/api/customers'
import { ApiYearWrite } from '/imports/api/yearWrite'
import HeadSingle from './HeadSingle.js';
import { browserHistory } from 'react-router';
import React, { Component } from 'react';
import { clone, cloneDeep, reverse, map } from 'lodash';

import PaymentsOnTab from './PaymentsOnTab/PaymentsOnTab.js'
import LinesOnTab from './LinesOnTab/LinesOnTab.js'

import { invoiceStateTypes } from '/imports/startup/typesList.js';

import './invoiceStyle.css'


export default class InvoiceSingle extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSendByEmail = this.handleSendByEmail.bind(this);
  }

// ====================== ON CHANGE ======================
  onChangeCustomer(value) {
    let newInvoice = this.state.dispInvoice;
    newInvoice.customerId = value;
    this.setState({dispInvoice: newInvoice, allowSave: true});
  }
  onChangeStatus(value) {
    let newInvoice = this.state.dispInvoice;
    newInvoice.status = value;
    this.setState({dispInvoice: newInvoice});
  }
  onChangeDate(value) {
    let newInvoice = this.state.dispInvoice;
    newInvoice.date = value;
    this.setState({dispInvoice: newInvoice});
  }
  onChangeDueDate(value) {
    let newInvoice = this.state.dispInvoice;
    newInvoice.dueDate = value;
    this.setState({dispInvoice: newInvoice});
  }
  onChangeNotes(value) {
    let newInvoice = this.state.dispInvoice;
    newInvoice.notes = value;
    this.setState({dispInvoice: newInvoice});
  }
// END ================== ON CHANGE ======================

  componentWillReceiveProps(nextProps) {
    let c = nextProps.invoice;


    if (this.state.editable) {
      c = clone(this.state.invoice);
    }

    let dataDispInvoice = clone(this.state.dispInvoice);

    if (!dataDispInvoice) {
      dataDispInvoice = clone(nextProps.invoice)
    }
    
    const allowSave = this.state.editable ? this.state.allowSave : c.customerId;

    c = nextProps.invoice;

    this.setState({
      invoice: clone(c),
      dispInvoice: dataDispInvoice,
      allowSave
    });
  }


  handleSave() {
    let newInvoice = clone(this.state.dispInvoice);
    let invoiceId;


    if(this.state.isNew){
      invoiceId = new Mongo.ObjectID();
      newInvoice._id = invoiceId;
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

      map(newInvoice.paymentsId, (el) => {
        Meteor.users.update({_id: this.state.invoice.customerId}, {$pull: { "profile.payments": el}});
        ApiPayments.update({_id: el}, {$set: {customerId: newInvoice.customerId}});
        Meteor.users.update({_id: newInvoice.customerId}, {$addToSet: { "profile.payments": el}});
      })
    }


    Meteor.users.update({_id: newInvoice.customerId}, {$addToSet: { "profile.invoices": invoiceId}});
    if (this.state.isNew) browserHistory.push(`/invoices/${invoiceId}`);
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
    browserHistory.push('/invoices');

    map(newInvoice.paymentsId, (el) => {
      Meteor.users.update({_id: this.state.invoice.customerId}, {$pull: { "profile.payments": el}});
      ApiPayments.remove({_id: el});
    })

    ApiInvoices.remove(this.state.invoice._id);
  }

  handleSendByEmail(){
    console.log('SEND BY EMAIL >>>>')
  }


  componentDidMount() {
    if (this.buttonEdit) {
      this.buttonEdit.disabled = false;
    }

    const allowSave = this.props.invoice ? this.props.invoice.customerId : undefined;
    this.setState({allowSave});
  }



  render() {

    console.log(this.state.invoice);
    
    const renderHeadSingle = () => {
      return (
        <HeadSingle onSave={this.handleSave}
                    onEdit={this.handleEdit}
                    onDelete={this.handleDelete}
                    onSendByEmail={this.handleSendByEmail}
                    allowSave={this.state.allowSave}
                    title={this.props.invoice.codeName} />
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
                <label htmlFor="paymentCustomerName" className='col-xs-2'>Customer Name</label>
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
                    <div className='col-xs-8'>
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
                  const custName = Meteor.users.findOne(custId) ? (Meteor.users.findOne(custId).profile.name + ' propfile') : '';

                  return (<Link to={`/customer/${custId}`}>{custName}</Link>);
                })()}
              </div>
              { /* END ============================= DROPDOWN CUSTOMERS ============================== */}
              <div className="form-group name col-xs-6">
                <label htmlFor="invoiceDate" className='col-xs-2'>Invoice date</label>
                {(() => {
                  if (this.state.editable) {
                    return (
                      <div className='col-xs-8 form-horizontal'>
                        <input
                          type="date"
                          id="invoceDate"
                          className="form-control "
                          onChange={(e) => this.onChangeDate(e.target.value)}
                          value={ this.state.dispInvoice.date }/>
                      </div>
                    )
                  }

                  return <div className='col-xs-8'>{date}</div>
                })()}
              </div>
            </div>

            <div className="row">
              <div className="form-group profit col-xs-6">
                <label htmlFor="invoiceStatus" className='col-xs-2'>Status</label>
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

                  return <div className='col-xs-8'>{status}</div>
                })()}
              </div>
              
              <div className="form-group name col-xs-6">
                <label htmlFor="invoiceDueDate" className='col-xs-2'>Invoice Due date</label>
                {(() => {
                  if (this.state.editable) {
                    return (
                      <div className='col-xs-8 form-horizontal'>
                        <input
                          type="date"
                          id="invoiceDueDate"
                          className="form-control "
                          onChange={(e) => this.onChangeDueDate(e.target.value)}
                          value={ this.state.dispInvoice.dueDate }/>
                      </div>
                    )
                  }

                  return <div className='col-xs-8'>{dueDate}</div>
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
              <div role="tabpanel" className="tab-pane p-x-1 active" id="lines">
              {
                <LinesOnTab 
                    invoice={cloneDeep(this.state.invoice)}
                    linesId={reverse(this.state.invoice.linesId)}
                    readOnly={!this.state.invoice.customerId}/>
              }
              </div>
              <div role="tabpanel" className="tab-pane p-x-1" id="payments">
                <PaymentsOnTab 
                    invoice={cloneDeep(this.state.invoice)}
                    paymentsId={reverse(this.state.invoice.paymentsId)}
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
          <div className="PaymentsOnTab row">
            <div className="col-xs-12">
              <h3>Payments list</h3>
              <PaymentsOnTab 
                      invoice={cloneDeep(this.state.invoice)}
                      paymentsId={this.state.invoice.paymentsId}
                      readOnly={true}/>
            </div>
          </div>                    
        </div>
      )
    } else {
      return (<div className="InvoiceSingle"></div>)
    }
  }
}


export default createContainer(({params}) => {
  Meteor.subscribe('invoices');
  Meteor.subscribe('users');
  Meteor.subscribe('yearwrite');


  let isNew = false;
  let invoiceId = params.invoiceId;
  let invoice = {};

  console.log('invoiceId', invoiceId);

  if (params.invoiceId.indexOf('new') === 0) {
    isNew = true;
  } else {
    invoice = ApiInvoices.findOne(new Mongo.ObjectID(invoiceId));
  }

  return {
    invoice,
    userList: Meteor.users.find({'profile.userType': 'customer'}).fetch(),
    isNew
  }

}, InvoiceSingle)
