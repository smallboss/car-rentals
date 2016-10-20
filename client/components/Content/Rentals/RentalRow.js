import React, { Component } from 'react';
import { map } from 'lodash';
import { Link } from 'react-router';

export default class RentalRow extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps (props) {
        this.input.checked = false;

        map(props.selectedCarsId, (item) => {
            if(item == props.item._id)
                this.input.checked = true;
        })
    }

    render(){
        const { rental, onHandleSelect, onClick } = this.props;
        console.log();

        return (
            <tr>
                <th><input type="checkbox" ref={(ref) => this.input = ref} onChange={(e) => onHandleSelect(e, rental)}/></th>
                <td onClick={onClick} ><Link to={`/managePanel/customer/${rental.customerId}`}>{ rental.customerId }</Link></td>
                <td onClick={onClick} ><Link to={`/managePanel/cars/${rental.carId}`}>{ rental.carId }</Link></td>
                <td onClick={onClick} >{ rental.dateFrom }</td>
                <td onClick={onClick} >{ rental.dateTo }</td>
            </tr>
        )
    }
}