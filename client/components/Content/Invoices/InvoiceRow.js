import React, { Component } from 'react';
import { Link } from 'react-router';
import { map } from 'lodash';
import { ApiLines } from '/imports/api/lines.js';


export default class InvoiceRow extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps (props) {
        this.input.checked = false;

        map(props.selectedInvoicesId, (item) => {
            if(item == props.item._id)
                this.input.checked = true;
        })
    }


    render(){
        const { item, onHandleSelect, onClick, customerName } = this.props;

        const renderAmount = () => {
            let totalAmount = 0;

            if (item.linesId) {
                item.linesId.map((el) => {
                    const line = ApiLines.findOne({ _id: el });
                    const amount = line ? line.amount : 0;
                    totalAmount += parseInt(amount ? amount : 0);
                })
            }

            return totalAmount;
        }


        return (
            <tr>
                <th>
                    <input 
                        type="checkbox" ref={(ref) => this.input = ref} 
                        onChange={(e) => onHandleSelect(e, item)} />
                </th>
                <td>
                    <Link to={`/managePanel/customer/${item.customerId}`}>{ customerName ? customerName.profile.name : '' }</Link>
                </td>
                <td onClick={onClick} >{ item.date }</td>
                <td onClick={onClick} >{ item.codeName}</td>
                <td onClick={onClick} >{ item.dueDate }</td>
                <td onClick={onClick} >{ renderAmount() }</td>
                <td onClick={onClick} >{ item.status }</td>
            </tr>
        )
    }
}