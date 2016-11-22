import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router'
import { Email } from 'meteor/email'
import { createContainer } from 'meteor/react-meteor-data';

import { ApiContracts } from '/imports/api/contracts.js';
import { ApiUsers } from '/imports/api/users';
import { ApiInvoices } from '/imports/api/invoices';
import { ApiPayments } from '/imports/api/payments';
import { ApiLines } from '/imports/api/lines';
import { ApiRentals, removeRental } from '/imports/api/rentals.js'

import ContractRow from './ContractRow.js';
import HeadList from './HeadList.js';

import { map, debounce, find } from 'lodash';


class Contracts extends Component {
  constructor(props, context) {
    super(props, context); 

    this.state = {
      loginLevel: context.loginLevel,
      selectedContractsID: [],
      foundItems: [],
      searchField: '',
      currentPage: 1,
      itemsOnPage: 10,
      selectedAll: false
    }

    this.handleSelect = this.handleSelect.bind(this);
    this.handleSelectAll = this.handleSelectAll.bind(this);
    this.handleChangeSearchField = debounce(this.handleChangeSearchField.bind(this), 350);
    this.removeContracts = this.removeContracts.bind(this);
    this.addContract = this.addContract.bind(this);
    this.pageUp = this.pageUp.bind(this);
    this.pageDown = this.pageDown.bind(this);
    this.handleClickOnRow = this.handleClickOnRow.bind(this);

    context.router;
  }


  componentWillReceiveProps(props, nextContext) {    
    if (this.props.contracts != props.contracts) {
      this.handleChangeSearchField(this.state.searchField, props);
    }

    this.setState({loginLevel: nextContext.loginLevel});
  }

  componentWillUpdate(nextProps, nextState){
    const lastPage = Math.ceil(nextState.foundItems.length / this.state.itemsOnPage);

    if(nextState.foundItems.length && this.state.currentPage > lastPage)
      this.setState({currentPage: lastPage});
  }


  componentDidMount(){
    this.setState({foundItems: this.props.contracts});
  }


  addContract() {
    browserHistory.push(`/managePanel/contracts/new`);
  }


  removeContracts() {
    this.state.selectedContractsID.map((contractID) => {
    
      // =======================
      let paymentsId = [];
      let linesId = [];
      let contract = ApiContracts.findOne(new Mongo.ObjectID(contractID));

      let invs = (contract && contract.invoicesId) ? contract.invoicesId : [];


      invs.map((el) => {
        let inv = find(this.props.invoices, {_id: el });
        inv = inv ? inv : {};
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
        const line = ApiLines.findOne({_id: el});
        if (line) removeRental(line.rentalId);
        ApiLines.remove({_id: el});
      })

      Meteor.users.update({_id: contract.customerId}, {$pull: { "profile.contracts": contract._id}});
      Meteor.users.update({_id: contract.managerId}, {$pull: { "profile.contracts": contract._id}});
      ApiContracts.remove(new Mongo.ObjectID(contractID));
      // =======================
    })


    const selectedAll = false;
    this.selectAll.checked = selectedAll;

    this.setState({selectedContractsID: [], selectedAll});
  }

  handleSelectAll(){
    const { selectedContractsID, itemsOnPage, foundItems, selectedAll } = this.state;
    let newSelectedContractsID = [];

    if (!selectedAll) {
      foundItems.map((itemContract, key) => {
          if((key >= (this.state.currentPage-1) * this.state.itemsOnPage) && 
             (key <   this.state.currentPage    * this.state.itemsOnPage)){

            if (!newSelectedContractsID.includes(itemContract._id._str)) {
              newSelectedContractsID.push(itemContract._id._str);
            }
          }
      });
    }

    this.selectAll.checked = !selectedAll;
    
    this.setState({selectedContractsID: newSelectedContractsID, selectedAll: !selectedAll});
  }


  handleSelect(e, Contract){
    let newSelectedContractsID = this.state.selectedContractsID;
    const ContractID = ""+Contract._id;
    const index = newSelectedContractsID.indexOf(ContractID)
    let currentSelectedAll = this.state.selectedAll;


    if (index === -1 ) 
      newSelectedContractsID.push(ContractID);
    else 
      newSelectedContractsID.splice(index, 1);
    
    if (currentSelectedAll || !newSelectedContractsID.length) {
      currentSelectedAll = false;
      this.selectAll.checked = currentSelectedAll;
    }

    this.setState({selectedContractsID: newSelectedContractsID, electedAll: currentSelectedAll});
  }


  handleChangeSearchField(queryText = this.state.searchField, props = this.props){
    const searchQuery = queryText.toLowerCase();

    var displayedContracts = props.contracts.filter(function(el) {
        const contractStatus = el.status ? el.status.toLowerCase()   : '';
        const contractTitle     = el.title    ? el.title.toLowerCase() : '';
        const contractCodeName     = el.codeName    ? el.codeName.toLowerCase() : '';
        const contractStartDate     = el.startDate    ? el.startDate.toLowerCase() : '';
        const contractEndDate     = el.endDate    ? el.endDate.toLowerCase() : '';


        let contractCustomerName = find(props.userList , {_id: el.customerId});
        contractCustomerName = contractCustomerName ? contractCustomerName.profile.name.toLowerCase() : '';

        let contractManagerName = find(props.userList , {_id: el.managerId});
        contractManagerName = contractManagerName ? contractManagerName.profile.name.toLowerCase() : '';

        return (contractStatus.indexOf(searchQuery)       !== -1 ||
                contractCodeName.indexOf(searchQuery)     !== -1 ||
                contractTitle.indexOf(searchQuery)        !== -1 ||
                contractStartDate.indexOf(searchQuery)    !== -1 ||
                contractEndDate.indexOf(searchQuery)      !== -1 ||
                contractCustomerName.indexOf(searchQuery) !== -1 ||
                contractManagerName.indexOf(searchQuery)  !== -1)
    });


    this.setState({
      searchField: queryText,
      foundItems: displayedContracts
    })
  }


  pageUp(){
    this.setState({currentPage: this.state.currentPage + 1 });
  }

  pageDown(){
    this.setState({currentPage: this.state.currentPage - 1 });
  }


  handleClickOnRow(itemId) {
    browserHistory.push(`/managePanel/contracts/${itemId}`);
    // this.context.router.push(`/payments/${paymentId}`)
  }


  render() {

    const renderContracts = () => {
      return this.state.foundItems.map((item, key) => {
        if((key >= (this.state.currentPage-1) * this.state.itemsOnPage) && 
           (key <   this.state.currentPage    * this.state.itemsOnPage)) {

          return <ContractRow 
                      key={`contract-${key}`} 
                      item={item} 
                      invoices={this.props.invoices}
                      lines={this.props.lines}
                      customerName={Meteor.users.findOne(item.customerId)}
                      managerName={Meteor.users.findOne(item.managerId)}
                      onClick={this.handleClickOnRow.bind(null, item._id)}
                      selectedContractsId={this.state.selectedContractsID} 
                      onHandleSelect={this.handleSelect}
                      loginLevel={this.state.loginLevel} />
          }
        }
      )
    }

    const renderHeadCheckBox = () => {
      if (this.state.loginLevel === 3) 
        if (this.state.foundItems.length) {
          return (
            <th>
              <input type="checkbox" 
                     ref={(ref) => this.selectAll = ref}
                     onChange={this.handleSelectAll}/>
            </th>
          )
        } else {
          return (
            <th>
              <input type="checkbox" 
                     ref={(ref) => this.selectAll = ref}
                     onChange={this.handleSelectAll}
                     disabled />
            </th>
          )
        }

      return null;
    }


    return (
      <div>
        <HeadList
          currentPage={this.state.currentPage}
          itemsOnPage={this.state.itemsOnPage}
          numbSelected={this.state.selectedContractsID.length}
          totalItems={this.state.foundItems.length}
          pageUp={this.pageUp}
          pageDown={this.pageDown}
          onChangeSearchField={this.handleChangeSearchField}
          onAddNew={this.addContract} 
          onRemoveContracts={this.removeContracts}
          loginLevel={this.state.loginLevel} />

        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              { renderHeadCheckBox() }
              <th>Contract title</th>
              <th>Customer</th>
              <th>Contract ID</th>
              <th>Last invoice Date</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Account manager</th>
            </tr>
          </thead>

          <tbody>
           { renderContracts() }
          </tbody>
        </table>
      </div>
    )
  }
}

Contracts.propTypes = {
  contracts: PropTypes.array.isRequired,
};

Contracts.contextTypes = {
  router: React.PropTypes.object.isRequired,
  loginLevel: React.PropTypes.number.isRequired
}


export default createContainer(() => {
  Meteor.subscribe('contracts');
  Meteor.subscribe('users');
  Meteor.subscribe('yearwrite');
  Meteor.subscribe('invoices');
  Meteor.subscribe('lines');


  return {
    contracts: ApiContracts.find().fetch(),
    userList: Meteor.users.find().fetch(),
    invoices: ApiInvoices.find().fetch(),
    lines: ApiLines.find().fetch()
  };
}, Contracts);