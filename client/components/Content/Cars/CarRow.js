import React, { Component } from 'react';
import { map } from 'lodash';

export default class CarRow extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps (props) {
        if (this.input) {
            this.input.checked = false;

            map(props.selectedCarsId, (item) => {
                if(item == props.car._id)
                    this.input.checked = true;
            })
        }
    }

    render(){
        const { car, onHandleSelect, onClick } = this.props;

        const renderCheckBox = () => {
            if (this.props.loginLevel === 3) {
                return (
                    <th>
                        <input 
                            type="checkbox" ref={(ref) => this.input = ref} 
                            onChange={(e) => onHandleSelect(e, car)} />
                    </th>
                )
            }

            return null;
        }

        return (
            <tr>
                { renderCheckBox() }
                <td onClick={onClick} >{ car.name }</td>
                <td onClick={onClick} >{ car.plateNumber }</td>
                <td onClick={onClick} >{ car.status }</td>
            </tr>
        )
    }
}