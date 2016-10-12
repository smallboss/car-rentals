import React, { Component, PropTypes } from 'react';
import { clone, map, reverse, cloneDeep } from 'lodash';

import TableHeadButtons from './TableHeadButtons.js';
import PaymentTabRow from './PaymentTabRow.js';

export default class PaymentsOnTab extends Component {
    constructor(props) {
        super(props); 

        this.state = {
        }
    }   

    render(){
        return(
            <div>
                <TableHeadButtons />

                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th><input type="checkbox" disabled/></th>
                            <th>Payment ID</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        <PaymentTabRow />
                    </tbody>
                </table>
            </div>
        )
    }
}