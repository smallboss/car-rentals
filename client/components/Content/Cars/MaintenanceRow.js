import React, { Component } from 'react';
import { map } from 'lodash';

import { maintenanceStateTypes } from '/imports/startup/typesList.js';

export default class MaintenanceRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            maintenance: this.props.maintenance
        }

        this.onChangeJobName = this.onChangeJobName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeAmount = this.onChangeAmount.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeEndDate = this.onChangeEndDate.bind(this);
    }


    componentWillUpdate(nextProps){
        console.log('nextProps', nextProps)
    }

    componentWillReceiveProps (props) {
        this.inputSelect.checked = false;

        map(props.selectedMaintenanceID, (item) => {
            if(item == props.maintenance._id)
                this.inputSelect.checked = true;
        })


        console.log('PROPS', this.props.editable)
    }


// ================= CHANGERS FIELDS =================================
    onChangeJobName(value){
        let newMaintenance = this.state.maintenance;
        newMaintenance.jobName = value;
        this.setState({maintenance: newMaintenance});
    }

    onChangeDescription(value){
        let newMaintenance = this.state.maintenance;
        newMaintenance.description = value;
        this.setState({maintenance: newMaintenance});
    }

    onChangeAmount(value){
        let newMaintenance = this.state.maintenance;
        newMaintenance.amount = value;
        this.setState({maintenance: newMaintenance});
    }

    onChangeStatus(value){
        let newMaintenance = this.state.maintenance;
        newMaintenance.status = value;
        this.setState({maintenance: newMaintenance});
    }
    onChangeDate(value){
        let newMaintenance = this.state.maintenance;
        newMaintenance.date = value;
        this.setState({maintenance: newMaintenance});
    }
    onChangeEndDate(value){
        let newMaintenance = this.state.maintenance;
        newMaintenance.endDate = value;
        this.setState({maintenance: newMaintenance});
    }
// END ============== CHANGERS FIELDS ============================


    componentDidUpdate(){
        this.inputSelect.disabled =
        this.inputName.disabled =
        this.inputDescription.disabled =
        this.inputDate.disabled =
        this.inputAmount.disabled =
        this.inputEndDate.disabled =
        this.inputStatus.disabled = !this.props.editable;
    }


    render(){
        const { onHandleSelect } = this.props;
        const { _id, jobName, description, status, date, endDate, amount } = this.state.maintenance;

        return (
            <tr>
                <th><input type="checkbox" ref={(ref) => this.inputSelect = ref} onChange={(e) => onHandleSelect(e, _id)}/></th>
                <td>
                    <input 
                        type="text"
                        onChange={this.onChangeJobID}
                        ref={(ref) => this.inputMaintenance = ref}
                        value={_id} />
                </td>
                <td>
                    <input 
                        type="text"
                        onChange={(e) => this.onChangeJobName(e.target.value)}
                        ref={(ref) => this.inputName = ref}
                        value={jobName} />
                </td>
                <td>
                    <input 
                        type="text"
                        onChange={(e) => this.onChangeDescription(e.target.value)}
                        ref={(ref) => this.inputDescription = ref}
                        value={description} />
                </td>
                <td>
                    <input 
                        type="date"
                        onChange={(e) => this.onChangeDate(e.target.value)}
                        ref={(ref) => this.inputDate = ref}
                        value={date} />
                </td>
                <td>
                    <select ref={(ref) => this.inputStatus = ref}
                            onChange={(e) => this.onChangeStatus(e.target.value)}>
                        <option value={status}>{status}</option>
                        {
                            maintenanceStateTypes.map((el, key) => {
                                if (el !== status){
                                    return (
                                        <option key={key} value={el}>{el}</option>
                                    )
                                }
                                return undefined;
                            }
                        )}
                    </select>
                </td>
                <td>
                    <input 
                        type="text"
                        onChange={(e) => this.onChangeAmount(e.target.value)}
                        ref={(ref) => this.inputAmount = ref}
                        value={amount} />
                </td>
                <td>
                    <input 
                        type="date"
                        onChange={(e) => this.onChangeEndDate(e.target.value)}
                        ref={(ref) => this.inputEndDate = ref}
                        value={endDate} />
                </td>
            </tr>
        )
    }
}