import React, { Component } from 'react';
import { Link } from 'react-router';
import { map } from 'lodash';

export default class PaymentRow extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps (props) {
        this.input.checked = false;

        map(props.selectedPaymentsId, (item) => {
            if(item == props.item._id)
                this.input.checked = true;
        })
    }


    componentDidMount(){
        console.log('this.props', this.props)
    }


    render(){
        const { item, onHandleSelect, onClick, customerName } = this.props;

        return (
            <tr>
                <th>
                    <input 
                        type="checkbox" ref={(ref) => this.input = ref} 
                        onChange={(e) => onHandleSelect(e, item)} />
                </th>
                <td>
                    <Link to={`/customers/${item.customerId}`}>{ customerName.username }</Link>
                </td>
                <td onClick={onClick} >{ item.date }</td>
                <td onClick={onClick} >{ item._id._str }</td>
                <td onClick={onClick} >{ item.amount }</td>
                <td onClick={onClick} >{ item.status }</td>
            </tr>
        )
    }
}