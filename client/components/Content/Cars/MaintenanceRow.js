import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { map, clone } from 'lodash';

import { maintenanceStateTypes } from '/imports/startup/typesList.js';

export default class MaintenanceRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            maintenance: this.props.maintenance,
            editable: this.props.editable
        }

        this.onChangeJobName = this.onChangeJobName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeAmount = this.onChangeAmount.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeEndDate = this.onChangeEndDate.bind(this);
    }


    componentWillReceiveProps (props) {
        this.inputSelect.checked = false;

        map(props.selectedMaintenance, (item) => {
            if(item._id == props.maintenance._id)
                this.inputSelect.checked = true;
        })


        this.setState({maintenance: props.maintenance, editable: props.editable});
    }


// ================= CHANGERS FIELDS =================================
    onChangeJobName(value){
        let newMaintenance = this.state.maintenance;
        newMaintenance.jobName = value;
        this.props.onEditingField(newMaintenance);
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
    componentDidMount(){
        if(this.props.focusing &&  this.inputName){
            this.inputName.focus();
        }
    }

<<<<<<< HEAD
    componentDidUpdate(){
        if(this.props.focusing &&  this.inputName){
            this.inputName.focus();
        }
    }

=======
>>>>>>> 2e39633d241368b516ff9318c938bcb613737732
    render(){
        const { onHandleSelect } = this.props;
        const { _id, jobName, description, status, date, endDate, amount } = this.state.maintenance;


        const buttonSave = () => {
            return (
                    <button
                        onClick={() => this.props.onSave(this.state.maintenance)}
                        ref={(ref) => this.buttonSave = ref}
                        className='btn btn-danger'>
                        Save
                    </button>
            )
        }

        return (
            <tr>
                <th>
                    <input type="checkbox" ref={(ref) => this.inputSelect = ref} onChange={(e) => onHandleSelect(e, this.state.maintenance)}/>
                </th>
                <td>
                    {/* ================ _id ============== */}

                    { this.state.editable ? buttonSave() : null }
                    
                    <span>{_id._str}</span>
                </td>
                <td>
                    {/* ================ jobName ============== */}
                    {(() => {
                        if(this.state.editable){
                            return (
                                <input 
                                    type="text"
                                    onChange={(e) => this.onChangeJobName(e.target.value)}
                                    ref={(ref) => this.inputName = ref}
                                    value={jobName} 
                                    autoFocus/>
                            )
                        } 

                        return <span>{jobName}</span>
                    })()}
                </td>
                <td>
                    {/* ================ description ============== */}
                    {(() => {
                        if(this.state.editable){
                            return (
                                <input 
                                    type="text"
                                    onChange={(e) => this.onChangeDescription(e.target.value)}
                                    value={description} />
                            )
                        } 

                        return <span>{description}</span>
                    })()}
                </td>
                <td>
                    {/* ================ date ============== */}
                    {(() => {
                        if(this.state.editable){
                            return (
                                 <input 
                                    type="date"
                                    onChange={(e) => this.onChangeDate(e.target.value)}
                                    value={date} />
                            )
                        } 

                        return <span>{date}</span>
                    })()}
                </td>
                <td>
                    {/* ================ status ============== */}
                    {(() => {
                        if(this.state.editable){
                            return(
                                <select onChange={(e) => this.onChangeStatus(e.target.value)}>
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
                            )
                        } 

                        return <span>{status}</span>
                    })()}
                </td>
                <td>
                    {/* ================ amount ============== */}
                    {(() => {
                        if(this.state.editable){
                            return (
                                <input 
                                    type="text"
                                    onChange={(e) => this.onChangeAmount(e.target.value)}
                                    value={amount} />
                            )
                        } 

                        return <span>{amount}</span>
                    })()}
                    
                </td>
                <td>
                    {/* ================ endDate ============== */}
                    {(() => {
                        if(this.state.editable){
                            return (
                                <input 
                                    type="date"
                                    onChange={(e) => this.onChangeEndDate(e.target.value)}
                                    value={endDate} />
                            )
                        } 

                        return <span>{endDate}</span>
                    })()}
                </td>
            </tr>
        )
    }
}