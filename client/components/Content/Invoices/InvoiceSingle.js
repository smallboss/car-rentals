import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiInvoices } from '/imports/api/invoices.js'
import { ApiUserList } from '/imports/api/userList.js'
// import HeadSingle from './HeadSingle.js';
import { browserHistory } from 'react-router';
import React, { Component } from 'react';
import { clone, cloneDeep, reverse } from 'lodash';

import { invoiceStateTypes } from '/imports/startup/typesList.js';


import './invoiceStyle.css'


export default class InvoiceSingle extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }





  render() {

    return (<div className="InvoiceSingle">InvoiceSingle</div>)
    
  }
}


export default createContainer(({params}) => {
  Meteor.subscribe('invoices');

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
    isNew: isNew
  }

}, InvoiceSingle)
