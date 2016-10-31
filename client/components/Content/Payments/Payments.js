import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router'

import { createContainer } from 'meteor/react-meteor-data';
import { ApiPayments } from '/imports/api/payments.js';
import { ApiInvoices } from '/imports/api/invoices.js';

import PaymentRow from './PaymentRow.js';
import HeadList from './HeadList.js';

import { map, debounce, find } from 'lodash';


class Payments extends Component {
  constructor(props, context) {
    super(props, context); 

    this.state = {
      selectedPaymentsID: [],
      loginLevel: context.loginLevel,
      foundItems: [],
      searchField: '',
      currentPage: 1,
      itemsOnPage: 10,
      selectedAll: false
    }

    this.handleSelect = this.handleSelect.bind(this);
    this.handleSelectAll = this.handleSelectAll.bind(this);
    this.handleChangeSearchField = debounce(this.handleChangeSearchField.bind(this), 350);
    this.removePayments = this.removePayments.bind(this);
    this.addPayment = this.addPayment.bind(this);
    this.pageUp = this.pageUp.bind(this);
    this.pageDown = this.pageDown.bind(this);
    this.handlePaymentSingleOnClick = this.handlePaymentSingleOnClick.bind(this);

    context.router
  }


  componentWillReceiveProps(props, nextContext) {    
    if (this.props.payments != props.payments) {
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
    this.setState({foundItems: this.props.payments});
  }


  addPayment() {
    browserHistory.push(`/managePanel/payments/new`);
  }


  removePayments() {
    this.state.selectedPaymentsID.map((paymentID) => {
      const payment = find(this.props.payments, {'_id': new Mongo.ObjectID(paymentID)});
      const invoice = ApiInvoices.findOne({paymentsId: payment._id});
      if (invoice) ApiInvoices.update({_id: invoice._id}, {$pull: { paymentsId: this.state.payment._id}});
      ApiPayments.remove(new Mongo.ObjectID(paymentID));
      Meteor.users.update({_id: payment.customerId}, {$pull: { "profile.payments": new Mongo.ObjectID(paymentID)}});   
    })

    this.setState({selectedPaymentsID: []});
  }


  handleSelectAll(){
    const { selectedPaymentsID, itemsOnPage, foundItems, selectedAll } = this.state;
    let newSelectedPaymentsID = [];

    if (!selectedAll) {
      foundItems.map((itemPayment, key) => {
          if((key >= (this.state.currentPage-1) * this.state.itemsOnPage) && 
             (key <   this.state.currentPage    * this.state.itemsOnPage)){

            if (!newSelectedPaymentsID.includes(itemPayment._id._str)) {
              newSelectedPaymentsID.push(itemPayment._id._str);
            }
          }
      });
    }

    this.selectAll.checked = !selectedAll;
    
    this.setState({selectedPaymentsID: newSelectedPaymentsID, selectedAll: !selectedAll});
  }


  handleSelect(e, Payment){
    let newSelectedPaymentsID = this.state.selectedPaymentsID;
    const PaymentID = ""+Payment._id;
    const index = newSelectedPaymentsID.indexOf(PaymentID)
    let currentSelectedAll = this.state.selectedAll;

    if (index === -1 ) 
      newSelectedPaymentsID.push(PaymentID);
    else 
      newSelectedPaymentsID.splice(index, 1);

    if (currentSelectedAll || !newSelectedPaymentsID.length) {
      currentSelectedAll = false;
      this.selectAll.checked = currentSelectedAll;
    }
    
    this.setState({selectedPaymentsID: newSelectedPaymentsID, electedAll: currentSelectedAll});
  }


  handleChangeSearchField(queryText = this.state.searchField, props = this.props){
    const searchQuery = queryText.toLowerCase();

    var displayedPayments = props.payments.filter(function(el) {
        const paymentAmount = el.amount ? el.amount.toLowerCase()   : '';
        const paymentStatus = el.status ? el.status.toLowerCase()   : '';
        const paymentDate   = el.date   ? el.date.toLowerCase()     : '';
        const paymentCodeName     = el.codeName    ? el.codeName.toLowerCase() : '';
        let paymentCustomerName = find(props.userList , {_id: el.customerId});
        paymentCustomerName = paymentCustomerName ? paymentCustomerName.profile.name : '';

        return (paymentAmount.indexOf(searchQuery) !== -1 ||
                paymentStatus.indexOf(searchQuery) !== -1 ||
                paymentDate.indexOf(searchQuery)   !== -1 ||
                paymentCodeName.indexOf(searchQuery)     !== -1 ||
                paymentCustomerName.indexOf(searchQuery) !== -1)
    });


    this.setState({
      searchField: queryText,
      foundItems: displayedPayments
    })
  }


  pageUp(){
    this.setState({currentPage: this.state.currentPage + 1 });
  }

  pageDown(){
    this.setState({currentPage: this.state.currentPage - 1 });
  }


  handlePaymentSingleOnClick(paymentId) {
    browserHistory.push(`/managePanel/payments/${paymentId}`);
    // this.context.router.push(`/payments/${paymentId}`)
  }


  render() {
    const renderPayments = () => {
      return this.state.foundItems.map((itemPayment, key) => {
        if((key >= (this.state.currentPage-1) * this.state.itemsOnPage) && 
           (key <   this.state.currentPage    * this.state.itemsOnPage)) {

          return <PaymentRow 
                      key={key} 
                      item={itemPayment} 
                      loginLevel={this.state.loginLevel}
                      customerName={Meteor.users.findOne(itemPayment.customerId)}
                      onClick={this.handlePaymentSingleOnClick.bind(null, itemPayment._id)}
                      selectedPaymentsId={this.state.selectedPaymentsID} 
                      onHandleSelect={this.handleSelect} />
          }
        }
      )
    }


    const renderHeadCheckBox = () => {
      if (this.state.loginLevel === 3) 
        return (
          <th>
            <input type="checkbox" 
                   ref={(ref) => this.selectAll = ref}
                   onChange={this.handleSelectAll} />
          </th>
        )

      return null;
    }



    return (
      <div>
        <HeadList
          currentPage={this.state.currentPage}
          itemsOnPage={this.state.itemsOnPage}
          numbSelected={this.state.selectedPaymentsID.length}
          totalItems={this.state.foundItems.length}
          pageUp={this.pageUp}
          pageDown={this.pageDown}
          onChangeSearchField={this.handleChangeSearchField}
          onAddNew={this.addPayment} 
          onRemovePayments={this.removePayments}
          loginLevel={this.state.loginLevel} />

        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              { renderHeadCheckBox() }
              <th>Customer Name</th>
              <th>Date</th>
              <th>Payment ID</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
           { renderPayments() }
          </tbody>
        </table>
      </div>
    )
  }
}

Payments.propTypes = {
  payments: PropTypes.array.isRequired,
};

Payments.contextTypes = {
  router: React.PropTypes.object.isRequired,
  loginLevel: React.PropTypes.number.isRequired
}


export default createContainer(() => {
  Meteor.subscribe('payments');
  Meteor.subscribe('users');
  Meteor.subscribe('yearwrite');
  Meteor.subscribe('users')

  return {
    payments: ApiPayments.find().fetch(),
    userList: Meteor.users.find({'profile.userType': 'customer'}).fetch()
  };
}, Payments);