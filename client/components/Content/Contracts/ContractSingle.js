import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data'
import { ApiInvoices } from '/imports/api/invoices.js'
import { ApiUsers } from '/imports/api/users'
import { ApiContracts } from '/imports/api/contracts'
import LinesOnTab from './LinesOnTab/LinesOnTab.js';
import HeadSingle from './HeadSingle.js';
import { browserHistory } from 'react-router';
import React, { Component } from 'react';
import { clone, cloneDeep, reverse, concat } from 'lodash';

import { contractStateTypes } from '/imports/startup/typesList.js';


import './paymentStyle.css'


export default class ContractSingle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contract: clone(this.props.contract),
      dispContract: clone(this.props.contract),
      isNew: this.props.isNew,
      allowSave: false,
      customerList: this.props.customerList,
      managerList: this.props.managerList,

      editable: this.props.isNew
    }


    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeCustomer = this.onChangeCustomer.bind(this);
    this.onChangeManager = this.onChangeManager.bind(this);
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeEndDate = this.onChangeEndDate.bind(this);
    this.onChangeTermsAndConditions = this.onChangeTermsAndConditions.bind(this);
    this.onChangeNotes = this.onChangeNotes.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSendByEmail = this.handleSendByEmail.bind(this);
  }

// ====================== ON CHANGE ======================
  onChangeTitle(value) {
    let newContract = this.state.dispContract;
    newContract.title = value;
    this.setState({dispContract: newContract});
  }
  onChangeCustomer(value) {
    let newContract = this.state.dispContract;
    newContract.customerId = value;
    this.setState({
        dispContract: newContract, 
        allowSave: (newContract.customerId && newContract.managerId)
    });
  }
  onChangeManager(value) {
    let newContract = this.state.dispContract;
    newContract.managerId = value;
    this.setState({
        dispContract: newContract, 
        allowSave: (newContract.customerId && newContract.managerId)
    });
  }
  onChangeStartDate(value) {
    let newContract = this.state.dispContract;
    newContract.startDate = value;
    this.setState({dispContract: newContract});
  }
  onChangeEndDate(value) {
    let newContract = this.state.dispContract;
    newContract.endDate = value;
    this.setState({dispContract: newContract});
  }
  onChangeStatus(value) {
    let newContract = this.state.dispContract;
    newContract.status = value;
    this.setState({dispContract: newContract});
  }
  onChangeTermsAndConditions(value){
    let newContract = this.state.dispContract;
    newContract.termsAndConditions = value;
    this.setState({dispContract: newContract});
  }
  onChangeNotes(value) {
    let newContract = this.state.dispContract;
    newContract.notes = value;
    this.setState({dispContract: newContract});
  }
// END ================== ON CHANGE ======================



  componentWillReceiveProps(nextProps) {
    let c = nextProps.contract;


    if (this.state.editable) {
      c = clone(this.state.contract);
    }

    let dataDispContract = clone(this.state.dispContract);

    if (!dataDispContract) {
      dataDispContract = clone(nextProps.contract)
    }

    const allowSave = this.state.editable 
                            ? this.state.allowSave 
                            : (c.customerId && c.managerId);

    this.setState({
      contract: clone(c),
      dispContract: dataDispContract,
      allowSave
    });
  }

  handleSave() {
    let newContract = clone(this.state.dispContract);


    let id = newContract._id;
    delete newContract._id;


    ApiContracts.update(id, {$set: newContract});


    // Meteor.users.update({_id: newPayment.customerId}, {$push: { "profile.payments": id}});
    

    newContract._id = id;

    this.setState({contract: newContract, dispContract: newContract, editable: false});
  }

  handleEdit() {
    const allowSave = (this.state.editable && this.state.contract.customerId && this.state.contract.managerId) 
                        ? this.state.allowSave
                        : false;

    this.setState({
        editable: !this.state.editable,
        dispContract: clone(this.state.contract),
        allowSave
    });
  }

  handleDelete() {
    browserHistory.push('/contracts');

    // Meteor.users.update({_id: this.state.payment.customerId}, {$pull: { "profile.payments": this.state.payment._id}});
    ApiPayments.remove(this.state.contract._id);
  }

  handleSendByEmail(){
    console.log('SEND BY EMAIL >>>>')
  }


  componentDidMount() {
    if (this.buttonEdit) {
      this.buttonEdit.disabled = false;
    }

    const allowSave = (this.props.contract) 
                            ? (this.props.contract.customerId && this.props.contract.managerId)
                            : undefined;

    this.setState({allowSave});
  }


  render() {

    const renderHeadSingle = () => {
      return (
        <HeadSingle onSave={this.handleSave}
                    onEdit={this.handleEdit}
                    onDelete={this.handleDelete}
                    onSendByEmail={this.handleSendByEmail}
                    allowSave={this.state.allowSave} />
      )
    }



    if (this.state.contract) {

      let {
        title,
        customerId,
        managerId,
        startDate,
        endDate,
        status,
        termsAndConditions,
        notes
      } = this.state.contract;


      const renderTitle = () => {
        if (this.state.editable) {
          return (
            <div className='col-xs-10 form-horizontal'>
              <input
                type="text"
                id="contractTitle"
                className="form-control "
                onChange={(e) => this.onChangeTitle(e.target.value)}
                value={ this.state.dispContract.title }/>
            </div>
          )
        }

        return <div className='col-xs-10'>{title}</div>
      }

      const renderStartDate = () => {
        if (this.state.editable) {
          return (
            <div className='col-xs-8 form-horizontal'>
              <input
                type="date"
                id="startDate"
                className="form-control "
                onChange={(e) => this.onChangeStartDate(e.target.value)}
                value={ this.state.dispContract.startDate }/>
            </div>
          )
        }

        return <div className='col-xs-8'>{startDate}</div>
      }

      const renderEndDate = () => {
        if (this.state.editable) {
          return (
            <div className='col-xs-8 form-horizontal'>
              <input
                type="date"
                id="startDate"
                className="form-control "
                onChange={(e) => this.onChangeEndDate(e.target.value)}
                value={ this.state.dispContract.endDate }/>
            </div>
          )
        }

        return <div className='col-xs-8'>{endDate}</div>
      }

      const renderStatus = () => {
        if (this.state.editable) {
          return (
            <div className='col-xs-8 form-horizontal'>
              <select className=' form-control' onChange={(e) => this.onChangeStatus(e.target.value)}>
                <option className='' value={this.state.dispContract.status}>{this.state.dispContract.status}</option>
                {
                  contractStateTypes.map((el, key) => {
                    if (el != this.state.dispContract.status) {
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
      }


      const renderCustomer = () => {
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
                      value={managerId}>{ userProfileName }
                    </option>
                  )

                })()}
                {
                  this.props.customerList.map((el, key) => {
                    const currentId = customerId ? customerId : '';
                    if (el._id != currentId) {
                      return (
                        <option 
                          key={key} 
                          value={el._id}>{(el.profile.name ? (el.profile.name + " : ") : '') + el.username}</option>
                      )
                    }
                    return undefined;
                  })
                }
              </select>
              {(() => {
                const custId = this.state.editable ? this.state.dispContract.customerId : customerId;
                const custName = Meteor.users.findOne(custId) ? Meteor.users.findOne(custId).username : '';

                return <Link to={`/customer/${custId}`}>{`${custName} propfile`}</Link>
              })()}
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
      }


      const renderManager = () => {
        if (this.state.editable) {
          return (
            <div className='col-xs-8 form-horizontal'>
              <select className=' form-control' onChange={(e) => this.onChangeManager(e.target.value)}>
                {(() => {
                  const {username, profile} = managerId ? Meteor.users.findOne(managerId)  : '';
                  const userProfileName = managerId ? (profile.name + ' : ' + username) : '';
                    
                  return (    
                    <option 
                      className='' 
                      value={managerId}>{ userProfileName }
                    </option>
                  )

                })()}
                {
                  this.props.managerList.map((el, key) => {
                    const currentId = managerId ? managerId : '';
                    if (el._id != currentId) {
                      return (
                        <option 
                          key={key} 
                          value={el._id}>{(el.profile.name ? (el.profile.name + " : ") : '') + el.username}</option>
                      )
                    }
                    return undefined;
                  })
                }
              </select>
              {(() => {
                const mantId = this.state.editable ? this.state.dispContract.managerId : managerId;
                const custName = Meteor.users.findOne(mantId) ? Meteor.users.findOne(mantId).username : '';

                return <Link to={`/customer/${mantId}`}>{`${custName} propfile`}</Link>
              })()}
            </div>
          )
        }

        return (
          <div className='col-xs-8'>
            {(() => {
              if (Meteor.users.findOne(managerId)) {
                const profile = Meteor.users.findOne(managerId).profile;
                return (profile.name ? (profile.name + ' : ') : '' ) + Meteor.users.findOne(managerId).username
              }
              return undefined;
            })()}
          </div>
        )
      }


      const renderTopFields = () => {
        return (
          <div className="topFields">
            <div className="row">
              <div className="form-group profit col-xs-12">
                <label htmlFor="contractTitle" className='col-xs-2'><h4>Contract Title:</h4></label>
                { renderTitle() }
              </div>
            </div>
            <div className="row">
              <div className="form-group profit col-xs-6">
                <label htmlFor="contractCustomerName" className='col-xs-2'>Customer Name</label>
                { renderCustomer() }
              </div>
              <div className="form-group profit col-xs-6">
                <label htmlFor="contractStartDate" className='col-xs-2'>Start Date</label>
                { renderStartDate() }
              </div>
            </div>
            <div className="row">
              <div className="form-group profit col-xs-6">
                <label htmlFor="contractAccountManager" className='col-xs-2'>Account manager</label>
                { renderManager() }
              </div>
              <div className="form-group profit col-xs-6">
                <label htmlFor="contractEndDate" className='col-xs-2'>End Date</label>
                { renderEndDate() }
              </div>
            </div>
            <div className="row">
              <div className="form-group profit col-xs-6 col-xs-push-6">
                <label htmlFor="contractStatus" className='col-xs-2'>Status</label>
                { renderStatus() }
              </div>
            </div>
          </div>
        )
      }


      const renderInvoiceLinesTable = () => {

        let linesId = [];

        if (this.props.contract.invoicesId) {
          this.props.contract.invoicesId.map((el) => {
            let invoice = ApiInvoices.findOne({_id: el});
            linesId = linesId.concat(invoice ? invoice.linesId : []);
          })
        }

        return (
          <LinesOnTab 
              invoice={cloneDeep(this.state.invoice)}
              linesId={reverse(linesId)}
              readOnly={true}/>
        )
      }


      const renderTabs = () => {
        return (
          <div className="row">
            <ul className="nav nav-tabs" role="tablist">
              <li className="active">
                <a href="#details" aria-controls="home" role="tab" data-toggle="tab">Details</a>
              </li>
              <li><a href="#terms" aria-controls="messages" role="tab" data-toggle="tab">Terms & conditions</a></li>
              <li><a href="#notes" aria-controls="messages" role="tab" data-toggle="tab">Notes</a></li>
            </ul>
            <div className="tab-content">
              <div role="tabpanel" className="tab-pane p-x-1 active" id="details">
                <h3>Invoice lines</h3>
                { renderInvoiceLinesTable() }
              </div>
              <div role="tabpanel" className="tab-pane p-x-1" id="terms">
                {(() => {
                  if (this.state.editable) {
                    return (
                      <textarea
                        className='form-control'
                        onChange={(e) => this.onChangeTermsAndConditions(e.target.value)}
                        value={this.state.dispContract.termsAndConditions}>
                      </textarea>
                    )
                  }
                  return <textarea className="form-control" rows="3" disabled value={notes}></textarea>
                })()}
              </div>
              <div role="tabpanel" className="tab-pane p-x-1" id="notes">
                {(() => {
                  if (this.state.editable) {
                    return (
                      <textarea
                        className='form-control'
                        onChange={(e) => this.onChangeNotes(e.target.value)}
                        value={this.state.dispContract.notes}>
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
        <div className="ContractSingle panel panel-default">

          { renderHeadSingle() }
          <div className='panel-body'>
            { renderTopFields() }

            { renderTabs() }
          </div>

        </div>
      )
    } else {
      return (<div className="ContractSingle"></div>)
    }
  }
}


export default createContainer(({params}) => {
  Meteor.subscribe('contracts');
  Meteor.subscribe('users');
  Meteor.subscribe('invoices');

  let isNew = false;
  let contractId = params.contractId;

  if (params.contractId.indexOf('new') === 0) {
    isNew = true;
    contractId = params.contractId.substring(3);
    window.history.pushState('object or string', 'Title', `/contracts/${contractId}`);
    // window.history.back();
  }


  const idForQuery = new Mongo.ObjectID(contractId);

  if (!idForQuery) {
    browserHistory.push('/contracts');
  }

  return {
    contract: ApiContracts.findOne(idForQuery),
    customerList: Meteor.users.find({'profile.userType': 'customer'}).fetch(),
    managerList: Meteor.users.find({'profile.userType': {$in:["admin","employee"]}}).fetch(),
    isNew: isNew
  }

}, ContractSingle)
