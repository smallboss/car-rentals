import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiInvoices } from '/imports/api/invoices.js'
import { ApiCustomers } from '/imports/api/customers'
import HeadSingle from './HeadSingle.js';
import { browserHistory } from 'react-router';
import React, { Component } from 'react';
import { clone, cloneDeep, reverse } from 'lodash';

import { invoiceStateTypes } from '/imports/startup/typesList.js';


import './invoiceStyle.css'


export default class InvoiceSingle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      invoice: clone(this.props.invoice),
      dispInvoice: clone(this.props.invoice),
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
    newInvoice.customerId = new Mongo.ObjectID(value);
    this.setState({dispInvoice: newInvoice});
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

    this.setState({
      invoice: clone(c),
      dispInvoice: dataDispInvoice
    });
  }

  handleSave() {
    let newInvoice = clone(this.state.dispInvoice);


    const id = newInvoice._id;
    delete newInvoice._id;


    ApiInvoices.update(id, {$set: newInvoice});

    newInvoice_id = id;

    this.setState({invoice: newInvoice, dispInvoice: newInvoice, editable: false});
  }

  handleEdit() {
    this.setState({editable: !this.state.editable, dispInvoice: clone(this.state.invoice)});
  }

  handleDelete() {
    browserHistory.push('/invoices');

    ApiInvoices.remove(this.state.invoice._id);
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

    const renderHeadSingle = () => {
      return (
        <HeadSingle onSave={this.handleSave}
                    onEdit={this.handleEdit}
                    onDelete={this.handleDelete}
                    onSendByEmail={this.handleSendByEmail} />
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
                            const userProfName = customerId 
                                                    ? ((profile.name 
                                                          ? (profile.name + ' : ') 
                                                          : '')
                                                     + username) 
                                                    : '';
                              
                            return (    
                              <option 
                                className='' 
                                value={customerId}>{userProfName}
                              </option>
                            )

                          })()}
                          {
                            this.props.userList.map((el, key) => {
                                const currentId = customerId ? customerId._str : ''
                                if (el._id && (el._id._str != currentId)) {
                                  return (
                                    <option 
                                      key={key} 
                                      value={el._id._str}>{(el.profile.name ? (el.profile.name + " : ") : '') + el.username}</option>
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
              <li>
                <a href="#lines" aria-controls="home" role="tab" data-toggle="tab">Lines</a>
              </li>
              <li><a href="#payments" aria-controls="messages" role="tab" data-toggle="tab">Payments</a></li>
              <li className="active"><a href="#notes" aria-controls="messages" role="tab" data-toggle="tab">Notes</a></li>
            </ul>
            <div className="tab-content">
              <div role="tabpanel" className="tab-pane p-x-1" id="lines">
              </div>
              <div role="tabpanel" className="tab-pane p-x-1" id="payments">
              </div>
              <div role="tabpanel" className="tab-pane p-x-1 active" id="notes">
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
      return (<div className="InvoiceSingle">InvoiceSingle</div>)
    }
  }
}


export default createContainer(({params}) => {
  Meteor.subscribe('invoices');
  Meteor.subscribe('customers');

  let isNew = false;
  let invoiceId = params.invoiceId;

  if (params.invoiceId.indexOf('new') === 0) {
    isNew = true;
    invoiceId = params.invoiceId.substring(3);
    window.history.pushState('object or string', 'Title', `/invoices/${invoiceId}`);
    // window.history.back();
  }


  const idForQuery = new Mongo.ObjectID(invoiceId);

  if (!idForQuery) {
    browserHistory.push('/invoices');
  }


  return {
    invoice: ApiInvoices.findOne(idForQuery),
    userList: Meteor.users.find().fetch(),
    isNew: isNew
  }

}, InvoiceSingle)
