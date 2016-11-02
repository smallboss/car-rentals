import React, { Component } from 'react';
import { map } from 'lodash';

export default class CarRow extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps (props) {
        this.input.checked = false;

        map(props.selectedCarsId, (item) => {
            if(item == props.car._id)
                this.input.checked = true;
        })
    }

    render(){
        const { car, onHandleSelect, onClick, carLines } = this.props;

        let totalExpense = 0,
            totalIncome = 0;

        car.maintenance.map((el) => {
            totalExpense += parseInt(el.amount ? el.amount : 0);
        })

        carLines.map((el) => {
            totalIncome += parseInt(el.amount ? el.amount : 0);
        })

        const profit = (parseInt(totalIncome) - parseInt(totalExpense))+'';

        return (
            <tr>
                <th><input type="checkbox" ref={(ref) => this.input = ref} onChange={(e) => onHandleSelect(e, car)}/></th>
                <td onClick={onClick} >{ car.name }</td>
                <td onClick={onClick} >{ car.plateNumber }</td>
                <td onClick={onClick} >{ car.status }</td>
                <td onClick={onClick} >{ totalExpense }</td>
                <td onClick={onClick} >{ totalIncome }</td>
                <td onClick={onClick} >{ profit }</td>
            </tr>
        )
    }
}