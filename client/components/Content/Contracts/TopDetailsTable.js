import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data'
import { ApiInvoices } from '/imports/api/invoices.js'
import { ApiUsers } from '/imports/api/users'
import { ApiContracts } from '/imports/api/contracts'
import { ApiYearWrite } from '/imports/api/yearWrite.js';
import LinesOnTab from './LinesOnTab/LinesOnTab.js';
import HeadSingle from './HeadSingle.js';
import { browserHistory } from 'react-router';
import React, { Component } from 'react';
import { clone, cloneDeep, reverse, concat } from 'lodash';

import { repeatPeriods, repeatNumbs } from '/imports/startup/typesList.js';

export default class InvSettings extends Component {
    constructor(props) {
        super(props);
    }

    render(){

      const { amount, invoices, remaining, toinvoice, isEditing, dispAmount, invoicedPaid } = this.props;

      const currentAmount = dispAmount ? dispAmount : amount;

      if (!dispAmount) {}

      const renderAmount = () => {
        return (
          <td>
            {(() => {
              if (isEditing) {
                return (
                  <input type="number"
                         min="0"
                         max="99999"
                         value={ dispAmount }
                         onChange={ (e) => this.props.onChangeAmount(e.target.value) } />
                )
              } else {
                return <span>{ dispAmount ? dispAmount : amount }</span>   
              }
              
            })()}
          </td>
        )
      }

      return (
        <div className="TopDetailsTable m-t-1">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Invoiced</th>
                <th>Remaining</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                { renderAmount() }
                <td>{ invoicedPaid }</td>
                <td>{ currentAmount - invoices }</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }
}