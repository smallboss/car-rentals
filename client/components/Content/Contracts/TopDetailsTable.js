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

      const { amount, invoices, remaining, toinvoice } = this.props;

        return (
          <div className="TopDetailsTable">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Invoices</th>
                  <th>Remaining</th>
                  <th>To invoice</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{ amount }</td>
                  <td>{ invoices }</td>
                  <td>{ remaining }</td>
                  <td>{ toinvoice }</td>
                </tr>
              </tbody>
            </table>
          </div>
        )
    }
}