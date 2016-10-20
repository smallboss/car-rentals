import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router'
import { Email } from 'meteor/email'
import { createContainer } from 'meteor/react-meteor-data';

import { ApiContracts } from '/imports/api/contracts.js';

import ContractRow from './ContractRow.js';
import HeadList from './HeadList.js';

import { map, debounce, find } from 'lodash';


class Contracts extends Component {
  constructor(props, context) {
    super(props, context); 

    this.state = {
      selectedContractsID: [],
      foundItems: [],
      searchField: '',
      currentPage: 1,
      itemsOnPage: 10
    }

    this.handleSelect = this.handleSelect.bind(this);
    this.handleChangeSearchField = debounce(this.handleChangeSearchField.bind(this), 350);
    this.removeContracts = this.removeContracts.bind(this);
    this.addContract = this.addContract.bind(this);
    this.pageUp = this.pageUp.bind(this);
    this.pageDown = this.pageDown.bind(this);
    this.handleClickOnRow = this.handleClickOnRow.bind(this);

    context.router;
  }


  componentWillReceiveProps(props) {    
    if (this.props.contracts != props.contracts) {
      this.handleChangeSearchField(this.state.searchField, props);
    }
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
      console.log('contractID', contractID);
      ApiContracts.remove(new Mongo.ObjectID(contractID));
    })

    console.log('this.state.selectedContractsID', this.state.selectedContractsID);

    this.setState({selectedContractsID: []});
  }


  handleSelect(e, Contract){
    let newSelectedContractsID = this.state.selectedContractsID;
    const ContractID = ""+Contract._id;
    const index = newSelectedContractsID.indexOf(ContractID)


    if (index === -1 ) 
      newSelectedContractsID.push(ContractID);
    else 
      newSelectedContractsID.splice(index, 1);
    

    this.setState({selectedContractsID: newSelectedContractsID});
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
                      customerName={Meteor.users.findOne(item.customerId)}
                      managerName={Meteor.users.findOne(item.managerId)}
                      onClick={this.handleClickOnRow.bind(null, item._id)}
                      selectedContractsId={this.state.selectedContractsID} 
                      onHandleSelect={this.handleSelect} />
          }
        }
      )
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
          onRemoveContracts={this.removeContracts} />

        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th><input type="checkbox" disabled="true"/></th>
              <th>Contract title</th>
              <th>Customer</th>
              <th>Contract ID</th>
              <th>Last invoice Date</th>
              <th>Total to invoice</th>
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
  router: React.PropTypes.object.isRequired
}


export default createContainer(() => {
  Meteor.subscribe('contracts');
  Meteor.subscribe('users');
  Meteor.subscribe('yearwrite');

  return {
    contracts: ApiContracts.find().fetch(),
    userList: Meteor.users.find().fetch()
  };
}, Contracts);