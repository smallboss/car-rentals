import React, { Component } from 'react';
import { Link } from 'react-router';
import { map } from 'lodash';

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

        return (
            <tr>
                <th>
                    <input 
                        type="checkbox" ref={(ref) => this.input = ref} 
                        onChange={(e) => onHandleSelect(e, item)} />
                </th>
                <td onClick={onClick} >{ item.title }</td>
                <td>
                    <Link to={`/customer/${item.customerId}`}>{ customerName ? customerName.username : ''}</Link>
                </td>
                <td onClick={onClick} >{ item.codeName }</td>
                <td onClick={onClick} >{ 'last invoice' }</td>
                <td onClick={onClick} >{ 'total to invoice' }</td>
                <td onClick={onClick} >{ item.startDate }</td>
                <td onClick={onClick} >{ item.endDate }</td>
                <td onClick={onClick} >{ item.status }</td>
                <td>
                    <Link to={`/customer/${item.managerId}`}>{ managerName ? managerName.username : ''}</Link>
                </td>
            </tr>
        )
    }
}