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
        const { car, onHandleSelect } = this.props;

        return (
            <tr>
                <th><input type="checkbox" ref={(ref) => this.input = ref} onChange={(e) => onHandleSelect(e, car)}/></th>
                <td>{ car.name }</td>
                <td>{ car.plateNumber }</td>
                <td>{ car.status }</td>
            </tr>
        )
    }
}