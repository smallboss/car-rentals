import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { Link } from 'react-router';
import { Email } from 'meteor/email'
import DatePicker from 'react-bootstrap-date-picker'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiInvoices } from '/imports/api/invoices.js'
import { ApiUsers } from '/imports/api/users'
import { ApiContracts } from '/imports/api/contracts'
import { ApiLines } from '/imports/api/lines'
import { ApiYearWrite } from '/imports/api/yearWrite.js';
import LinesOnTab from './LinesOnTab/LinesOnTab.js';
import InvSettings from './InvSettings.js';
import HeadSingle from './HeadSingle.js';
import TopDetailsTable from './TopDetailsTable.js';
import { browserHistory } from 'react-router';
import React, { Component } from 'react';
import { clone, cloneDeep, reverse, concat, find } from 'lodash';
import { getContractMsg } from '/client/helpers/generatorTextMessages.js'

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

      invs: [],
      amount: 0,
      invoices: 0,
      remaining: 0,
      toinvoice: 0,

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
    this.handlePrint = this.handlePrint.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSendByEmail = this.handleSendByEmail.bind(this);

    this.onChangeGenAuto = this.onChangeGenAuto.bind(this);
    this.onChangeRepeatPeriod = this.onChangeRepeatPeriod.bind(this);
    this.onChangeRepeatNumb = this.onChangeRepeatNumb.bind(this);

  }

// ====================== ON CHANGE ======================
  onChangeGenAuto(checked) {
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
    newContract.startDate = value.slice(0, 10);
    this.setState({dispContract: newContract});
  }
  onChangeEndDate(value) {
    let newContract = this.state.dispContract;
    newContract.endDate = value.slice(0, 10);
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


    // ================
      let linesId = [];
      let invs = [];
      let nextLines = [];
      let nextTime = 0;

      if (nextProps.contract && nextProps.contract.invoicesId) {
        nextProps.contract.invoicesId.map((el) => {
          const invoice = find(nextProps.invoices, ['_id', el]);
          const codeName = invoice ? invoice.codeName : '';
          const status = invoice ? invoice.status : '';
          const length = (invoice && invoice.linesId) ? invoice.linesId.length : 0
          invs.push({_id: el, codeName, numb: length, status});
          linesId = linesId.concat(invoice ? invoice.linesId : []);

          const date = invoice ? invoice.date : '';
          if ((!nextTime || nextTime > new Date(date).getTime())) {
            if (!isNaN((new Date(date)).getTime())) {

              nextLines = invoice ? invoice.linesId : [];
            }
          }
        })
      }


      let lines = [];
      let amount = 0;
      let invoices = 0;
      let remaining = 0;
      let toinvoice = 0;
      
      if (nextLines){
        nextLines.map((el) => {
          let line = find(nextProps.lines, ['_id', el]);
          toinvoice += parseInt(line ? line.amount : 0);
        })
      }
      

      let inv = cloneDeep(invs);

      if (linesId.length && nextProps.lines.length) {
        linesId.map((el) => {
          let line = find(nextProps.lines, ['_id', el]);
          amount += parseInt(line ? line.amount : 0);
          lines.push(line);
          let status;
          if (inv[0]) {
              status = inv[0].status;
              inv[0].numb--;
              if (inv[0].numb === 0) inv.splice(0, 1);
          }

          console.log('line', line, status);

          if (status === 'paid') invoices += parseInt(line ? line.amount : 0);
          if (status === 'open' || !status) {
            remaining += parseInt(line ? line.amount : 0);
          }
        })
      }
    // ================


    this.setState({
      contract: clone(c),
      dispContract: dataDispContract,
      allowSave,
      amount, 
      invoices,
      remaining,
      toinvoice,
      lines, 
      invs
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


    Meteor.users.update({_id: newContract.customerId}, {$addToSet: { "profile.contracts": contractId}});
    Meteor.users.update({_id: newContract.managerId}, {$addToSet: { "profile.contracts": contractId}});
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

    let paymentsId = [];
    let linesId = [];
    let invs = cloneDeep(this.state.invs);

    invs.map((el) => {
      const inv = find(this.props.invoices, {_id: el._id });
      paymentsId = paymentsId.concat(inv.paymentsId);
      linesId = linesId.concat(inv.linesId);
      const customerId = inv.customerId;
      Meteor.users.update({_id: customerId}, {$pull: { 'profile.invoices': el }})
      ApiInvoices.remove({_id: el});
    })

    // REMOVE PAYMENTS ========================
    paymentsId.map((el) => {
      const customerId = ApiPayments.find({_id: el}).customerId;
      Meteor.users.update({_id: customerId}, {$pull: { 'profile.payments': el }})
      ApiPayments.remove({_id: el});
    })
    // REMOVE LINES ========================
    linesId.map((el) => {
      ApiLines.remove({_id: el});
    })

    Meteor.users.update({_id: this.state.contract.customerId}, {$pull: { "profile.contracts": this.state.contract._id}});
    Meteor.users.update({_id: this.state.contract.managerId}, {$pull: { "profile.contracts": this.state.contract._id}});
    ApiContracts.remove(this.state.contract._id);
  }

  handleSendByEmail(){
    let email = find(this.props.customerList, ['_id', Meteor.userId()]).emails[0];

    Meteor.call('sendEmail',
            email.address,
            'smallboss@live.ru',
            'Contract ' + this.state.contract.codeName,
            getContractMsg(this.state.contract._id, ));
  }

  handlePrint(){
    console.log('PRINT >>>>')
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
        <HeadSingle onPrint={this.handlePrint}
                    onSave={this.handleSave}
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

        return <div className='col-xs-9 m-t-015'>{title}</div>
      }

      const renderStartDate = () => {
        if (this.state.editable) {
          return (
            <div className='col-xs-8 form-horizontal'>
              <DatePicker
                    onChange={ this.onChangeStartDate }
                    value={ this.state.dispContract.startDate }/>
            </div>
          )
        }

        return <div className='col-xs-8 m-t-015'>{startDate}</div>
      }

      const renderEndDate = () => {
        if (this.state.editable) {
          return (
            <div className='col-xs-8 form-horizontal'>
              <DatePicker
                    onChange={ this.onChangeEndDate }
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
        return (
            <LinesOnTab 
                invoices={reverse(clone(this.state.invs))}
                lines={reverse(clone(this.state.lines))}
                readOnly={true} />
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
                <TopDetailsTable 
                    amount={this.state.amount}
                    invoices={this.state.invoices}
                    remaining={this.state.remaining}
                    toinvoice={this.state.toinvoice} />

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
                                contract={this.state.dispContract}
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
  Meteor.subscribe('lines');

  let isNew = false;
  let contractId = params.contractId;
  let contract = {};

  if (params.contractId.indexOf('new') === 0) {
    isNew = true;
  } else {
    contract = ApiContracts.findOne(new Mongo.ObjectID(contractId));
  }

  const invoices = ApiInvoices.find({}).fetch();

  // console.log('invoices', invoices);
  // console.log('line', ApiLines.find({}).fetch());

  return {
    contract,
    customerList: Meteor.users.find({'profile.userType': 'customer'}).fetch(),
    managerList: Meteor.users.find({'profile.userType': {$in:["admin","employee"]}}).fetch(),
    invoices,
    lines: ApiLines.find({}).fetch(),
    isNew
  }

}, ContractSingle)
