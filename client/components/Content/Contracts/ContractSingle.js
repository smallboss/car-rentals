import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data'
import { ApiInvoices } from '/imports/api/invoices.js'
import { ApiUsers } from '/imports/api/users'
import { ApiContracts } from '/imports/api/contracts'
import { ApiYearWrite } from '/imports/api/yearWrite.js';
import LinesOnTab from './LinesOnTab/LinesOnTab.js';
import InvSettings from './InvSettings.js';
import HeadSingle from './HeadSingle.js';
import TopDetailsTable from './TopDetailsTable.js';
import { browserHistory } from 'react-router';
import React, { Component } from 'react';
import { clone, cloneDeep, reverse, concat } from 'lodash';

import { contractStateTypes } from '/imports/startup/typesList.js';

import '/client/main.css'


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

    this.onChangeGenAuto = this.onChangeGenAuto.bind(this);
    this.onChangeRepeatPeriod = this.onChangeRepeatPeriod.bind(this);
    this.onChangeRepeatNumb = this.onChangeRepeatNumb.bind(this);

  }

// ====================== ON CHANGE ======================
  onChangeGenAuto(checked) {
    console.log(checked);
    let newContract = this.state.dispContract;
    newContract.genAuto = checked;
    this.setState({dispContract: newContract});
  }
  onChangeRepeatPeriod(value) {
    let newContract = this.state.dispContract;
    newContract.repeatPeriod = value;
    this.setState({dispContract: newContract});
  }
  onChangeRepeatNumb(value) {
    let newContract = this.state.dispContract;
    newContract.repeatNumb = value;
    this.setState({dispContract: newContract});
  }

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
                            : (c && c.customerId && c.managerId);

    c = nextProps.contract;

    this.setState({
      contract: clone(c),
      dispContract: dataDispContract,
      allowSave
    });
  }

  handleSave() {
    let newContract = clone(this.state.dispContract);
    let contractId;


    if(this.state.isNew){
      contractId = new Mongo.ObjectID();
      newContract._id = contractId;
      ApiContracts.insert(newContract);

      let yearWrite = ApiYearWrite.findOne({year: '2016'});
      let contractsNumb = '1';

      if (yearWrite) {
        if(!yearWrite.contractsNumb) yearWrite.contractsNumb = '0';
        yearWrite.contractsNumb = ''+(parseInt(yearWrite.contractsNumb)+1);
        contractsNumb = parseInt(yearWrite.contractsNumb);
      } else {
        yearWrite = {
            _id: new Mongo.ObjectID(),
            contractsNumb: contractsNumb
        };
        
        ApiYearWrite.insert({
            _id: yearWrite._id, 
            year: ''+(new Date()).getFullYear()
        });
      }

      if (yearWrite.contractsNumb.length == 1)
        contractsNumb = '00'+contractsNumb;
      else if (yearWrite.contractsNumb.length <= 2)
          contractsNumb = '0'+contractsNumb;
          else contractsNumb = ''+contractsNumb;

      let codeName = `CO/${(new Date()).getFullYear()}/${contractsNumb}`;

      ApiContracts.update(contractId, {$set: { codeName }});

      contractsNumb = ''+parseInt(contractsNumb);
      ApiYearWrite.update({_id: yearWrite._id }, {$set: { contractsNumb }});
    } else {
      contractId = newContract._id;
      delete newContract._id;
      ApiContracts.update(contractId, {$set: newContract});
    }


    Meteor.users.update({_id: newContract.contractId}, {$addToSet: { "profile.contracts": contractId}});
    if (this.state.isNew) browserHistory.push(`/managePanel/contracts/${contractId}`);
    this.setState({contract: newContract, dispContract: newContract, editable: false, isNew: false});
  }

  handleEdit() {
    this.setState({
        editable: !this.state.editable,
        dispContract: clone(this.state.contract),
        allowSave: (this.state.contract.customerId && this.state.contract.managerId)
    });
  }

  handleDelete() {
    browserHistory.push('/managePanel/contracts');

    // Meteor.users.update({_id: this.state.payment.customerId}, {$pull: { "profile.payments": this.state.payment._id}});
    ApiContracts.remove(this.state.contract._id);
  }

  handleSendByEmail(){
    console.log('SEND BY EMAIL >>>>')
  }

  componentWillMount() {
    this.inputGenAuto = {};
  }


  componentDidMount() {
    if (this.buttonEdit) {
      this.buttonEdit.disabled = false;
    }

    const allowSave = (this.props.contract) 
                            ? (this.props.contract.customerId && this.props.contract.managerId)
                            : undefined;


    this.inputGenAuto.checked = this.state.contract ? this.state.contract.genAuto : false;

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
                    title={this.props.contract.codeName} />
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
            <div className='col-xs-9 form-horizontal'>
              <input
                type="text"
                id="contractTitle"
                className="form-control "
                onChange={(e) => this.onChangeTitle(e.target.value)}
                value={ this.state.dispContract.title }/>
            </div>
          )
        }

        return <div className='col-xs-10 m-t-05'>{title}</div>
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

        return <div className='col-xs-8 m-t-05'>{startDate}</div>
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

        return <div className='col-xs-8 m-t-05'>{endDate}</div>
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

        return <div className='col-xs-8 m-t-05'>{status}</div>
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
            </div>
          )
        }

        return (
          <div className='col-xs-8 m-t-05'>
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
                <label htmlFor="contractTitle" className='col-xs-3'><h4>Contract Title:</h4></label>
                { renderTitle() }
              </div>
            </div>
            <div className="row">
              <div className="form-group profit col-xs-6">
                <label htmlFor="contractCustomerName" className='col-xs-3'>Customer Name</label>
                { renderCustomer() }

                {(() => {
                  const custId = this.state.editable ? this.state.dispContract.customerId : customerId;
                  const custName = Meteor.users.findOne(custId) ? (Meteor.users.findOne(custId).profile.name + " profile") : '';

                  return <Link to={`/managePanel/customer/${custId}`} className="col-xs-12">{`${custName}`}</Link>
                })()}
              </div>
              <div className="form-group profit col-xs-6">
                <label htmlFor="contractStartDate" className='col-xs-3'>Start Date</label>
                { renderStartDate() }
              </div>
            </div>
            <div className="row">
              <div className="form-group profit col-xs-6">
                <label htmlFor="contractAccountManager" className='col-xs-3'>Account manager</label>
                { renderManager() }

                {(() => {
                  const manId = this.state.editable ? this.state.dispContract.managerId : managerId;
                  const manName = Meteor.users.findOne(manId) ? (Meteor.users.findOne(manId).profile.name + " profile") : '';

                  return <Link to={`/managePanel/customer/${manId}`} className="col-xs-12">{`${manName}`}</Link>
                })()}
              </div>
              <div className="form-group profit col-xs-6">
                <label htmlFor="contractEndDate" className='col-xs-3'>End Date</label>
                { renderEndDate() }
              </div>
            </div>
            <div className="row">
              <div className="form-group profit col-xs-6 col-xs-push-6">
                <label htmlFor="contractStatus" className='col-xs-3'>Status</label>
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
                <TopDetailsTable />

                <h3>Invoicing settings</h3>
                {(() => {
                  if (this.state.editable)
                    return <InvSettings 
                                onChangeGenAuto={this.onChangeGenAuto}
                                onChangeRepeatPeriod={this.onChangeRepeatPeriod}
                                onChangeRepeatNumb={this.onChangeRepeatNumb}
                                contract={this.state.dispContract} 
                                editable={this.state.editable}/>
                  else 
                    return <InvSettings
                                contract={this.state.contract} 
                                editable={this.state.editable}/>
                })()}

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
  Meteor.subscribe('yearwrite');

  let isNew = false;
  let contractId = params.contractId;
  let contract = {};

  if (params.contractId.indexOf('new') === 0) {
    isNew = true;
  } else {
    contract = ApiContracts.findOne(new Mongo.ObjectID(contractId));
  }

  return {
    contract,
    customerList: Meteor.users.find({'profile.userType': 'customer'}).fetch(),
    managerList: Meteor.users.find({'profile.userType': {$in:["admin","employee"]}}).fetch(),
    isNew
  }

}, ContractSingle)
