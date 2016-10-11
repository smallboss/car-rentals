import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router'

import { createContainer } from 'meteor/react-meteor-data';

import { ApiInvoices } from '/imports/api/invoices.js';
import { ApiUserList } from '/imports/api/userList.js'
import InvoiceRow from './InvoiceRow.js';
import HeadList from './HeadList.js';

import { map, debounce } from 'lodash';


class Invoices extends Component {
  constructor(props, context) {
    super(props, context); 

    this.state = {
      selectedInvoicesID: [],
      foundItems: [],
      searchField: '',
      currentPage: 1,
      itemsOnPage: 10
    }

    this.handleSelect = this.handleSelect.bind(this);
    this.handleChangeSearchField = debounce(this.handleChangeSearchField.bind(this), 350);
    this.removeInvoices = this.removeInvoices.bind(this);
    this.addInvoice = this.addInvoice.bind(this);
    this.pageUp = this.pageUp.bind(this);
    this.pageDown = this.pageDown.bind(this);
    this.handleInvoiceSingleOnClick = this.handleInvoiceSingleOnClick.bind(this);

    context.router
  }


  componentWillReceiveProps(props) {    
    if (this.props.invoices != props.invoices) {
      this.handleChangeSearchField(this.state.searchField, props);
    }

    console.log(',props.invoices', props.invoices)
  }

  componentWillUpdate(nextProps, nextState){
    const lastPage = Math.ceil(nextState.foundItems.length / this.state.itemsOnPage);

    if(nextState.foundItems.length && this.state.currentPage > lastPage)
      this.setState({currentPage: lastPage});
  }


  componentDidMount(){
    this.setState({foundItems: this.props.invoices});``
  }


  addInvoice() {
    const _id = new Mongo.ObjectID();
    ApiInvoices.insert({ _id});
    browserHistory.push(`/invoices/new${_id}`);
  }


  removeInvoices() {
    console.log('DEL')
    this.state.selectedInvoicesID.map((invoiceID) => {
      ApiInvoices.remove(new Mongo.ObjectID(invoiceID));
    })

    this.setState({selectedInvoicesID: []});
  }


  handleSelect(e, Invoice){
    let newSelectedInvoicesID = this.state.selectedInvoicesID;
    const InvoiceID = ""+Invoice._id;
    const index = newSelectedInvoicesID.indexOf(InvoiceID)


    if (index === -1 ) 
      newSelectedInvoicesID.push(InvoiceID);
    else 
      newSelectedInvoicesID.splice(index, 1);
    

    this.setState({selectedInvoicesID: newSelectedInvoicesID});
  }


  handleChangeSearchField(queryText = this.state.searchField, props = this.props){
    const searchQuery = queryText.toLowerCase();

    var displayedInvoices = props.invoices.filter(function(el) {
        const invoiceAmount = el.amount      ? el.amount.toLowerCase()      : '';
        const invoiceStatus = el.status      ? el.status.toLowerCase()      : '';
        const invoiceDate   = el.date        ? el.date.toLowerCase()        : '';
        const invoiceID     = el._id         ? el._id._str.toLowerCase()    : '';

        return (invoiceAmount.indexOf(searchQuery) !== -1 ||
                invoiceStatus.indexOf(searchQuery) !== -1 ||
                invoiceDate.indexOf(searchQuery)   !== -1 ||
                invoiceID.indexOf(searchQuery)     !== -1)
    });


    this.setState({
      searchField: queryText,
      foundItems: displayedInvoices
    })
  }


  pageUp(){
    this.setState({currentPage: this.state.currentPage + 1 });
  }

  pageDown(){
    this.setState({currentPage: this.state.currentPage - 1 });
  }


  handleInvoiceSingleOnClick(invoiceId) {
    console.log('invoiceId', invoiceId)
    browserHistory.push(`/invoices/${invoiceId}`);
    // this.context.router.push(`/payments/${paymentId}`)
  }


  render() {

    const renderInvoices = () => {
      return this.state.foundItems.map((itemInvoice, key) => {
        if((key >= (this.state.currentPage-1) * this.state.itemsOnPage) && 
           (key <   this.state.currentPage    * this.state.itemsOnPage))

          console.log('itemInvoice', itemInvoice)

          return <InvoiceRow 
                      key={key} 
                      item={itemInvoice} 
                      customerName={Meteor.users.findOne(itemInvoice.customerId)}
                      onClick={this.handleInvoiceSingleOnClick.bind(null, itemInvoice._id)}
                      selectedInvoicesId={this.state.selectedInvoicesID} 
                      onHandleSelect={this.handleSelect} />
        }
      )
    }

    return (
      <div>
        <HeadList
          currentPage={this.state.currentPage}
          itemsOnPage={this.state.itemsOnPage}
          numbSelected={this.state.selectedInvoicesID.length}
          totalItems={this.state.foundItems.length}
          pageUp={this.pageUp}
          pageDown={this.pageDown}
          onChangeSearchField={this.handleChangeSearchField}
          onAddNew={this.addInvoice} 
          onRemoveItems={this.removeInvoices} />

        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th><input type="checkbox" disabled="true"/></th>
              <th>Customer Name</th>
              <th>Date</th>
              <th>Invoice ID</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
           { renderInvoices() }
          </tbody>
        </table>
      </div>
    )
  }
}

Invoices.propTypes = {
  invoices: PropTypes.array.isRequired,
};

Invoices.contextTypes = {
  router: React.PropTypes.object.isRequired
}


export default createContainer(() => {
  Meteor.subscribe('invoices');
  Meteor.subscribe("userList");

  return {
    invoices: ApiInvoices.find().fetch(),
    userList: Meteor.users.find().fetch()
  };
}, Invoices);