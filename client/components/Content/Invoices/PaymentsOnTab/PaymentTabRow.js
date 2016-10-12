import React, { Component, PropTypes } from 'react';

export default class PaymentTabRow extends Component {
    constructor(props) {
        super(props); 

        this.state = {
        }
    }   

    render(){
        return(
            <tr className="PaymentTabRow">
                <th><input type="checkbox" /></th>
                <td>Payment ID</td>
                <td>Date</td>
                <td>Amount</td>
                <td>Status</td>
            </tr>
        )
    }
}