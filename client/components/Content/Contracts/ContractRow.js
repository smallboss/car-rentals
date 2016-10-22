import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { map, find } from 'lodash';

import { ApiInvoices } from '/imports/api/invoices';
import { ApiLines } from '/imports/api/lines';
import { createContainer } from 'meteor/react-meteor-data';

export default class ContractRow extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps (props) {
        this.input.checked = false;

        map(props.selectedContractsId, (item) => {
            if(item == props.item._id)
                this.input.checked = true;
        })
    }


    render(){
        const { item, onHandleSelect, onClick, customerName, managerName } = this.props;


        const renderLastInvoiceDate = () => {
            let startDate =
                lastInvoiceDate = (new Date('1970/01/01')).getTime();


            if (item.invoicesId) {
                item.invoicesId.map((invoiceId) => {
                    const invoice = find(this.props.invoices, ['_id', invoiceId ]);

                    if (invoice) {
                        const currentInvDate = (new Date(invoice.date)).getTime();

                        console.log(currentInvDate, lastInvoiceDate, Date.now(), invoice.date);
                        if (currentInvDate > lastInvoiceDate && currentInvDate < Date.now()) {
                            lastInvoiceDate = currentInvDate;
                        }
                    }
                })
            }

            const year  = (new Date(lastInvoiceDate)).getFullYear();
            const month = (new Date(lastInvoiceDate)).getMonth()+1;
            const day   = (new Date(lastInvoiceDate)).getDate();

            console.log();

            return (lastInvoiceDate !== startDate) ? `${year}/${month}/${day}` : '';   
        }


        const renderTotalToInvoice = () => {
            let totalToInvoice = 0;

            if (item.invoicesId) {
                item.invoicesId.map((invoiceId) => {
                    const invoice = find(this.props.invoices, ['_id', invoiceId ]);

                    if (invoice && invoice.linesId) {
                        invoice.linesId.map((lineId) => {
                            line = find(this.props.lines, ['_id', lineId ]);

                            totalToInvoice += line ? parseInt(line.amount) : 0;
                        })
                    }
                })
            }

            return totalToInvoice;
        }


        return (
            <tr>
                <th>
                    <input 
                        type="checkbox" ref={(ref) => this.input = ref} 
                        onChange={(e) => onHandleSelect(e, item)} />
                </th>
                <td onClick={onClick} >{ item.title }</td>
                <td>
                    <Link to={`/managePanel/customer/${item.customerId}`}>{ customerName ? customerName.username : ''}</Link>
                </td>
                <td onClick={onClick} >{ item.codeName }</td>
                <td onClick={onClick} >{ renderLastInvoiceDate() }</td>
                <td onClick={onClick} >{ renderTotalToInvoice() }</td>
                <td onClick={onClick} >{ item.startDate }</td>
                <td onClick={onClick} >{ item.endDate }</td>
                <td onClick={onClick} >{ item.status }</td>
                <td>
                    <Link to={`/managePanel/customer/${item.managerId}`}>{ managerName ? managerName.username : ''}</Link>
                </td>
            </tr>
        )
    }
}

ContractRow.propTypes = {
  invoices: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('invoices');

  return {
    invoices: ApiInvoices.find().fetch()
  };
}, ContractRow);