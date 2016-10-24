import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-bootstrap-date-picker'
import { map, clone } from 'lodash';
import { maintenanceStateTypes } from '/imports/startup/typesList.js';

import '/client/main.css'

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

        value = (value!='' && isNaN(parseInt(value))) ? '0' : value;
        let isDepr = false;

        isDepr = ((parseInt(value) < 0) || 
                  (value.indexOf('e') != -1) || 
                  (value.indexOf('E') != -1) ||  
                  (value.length > 5));

        newMaintenance.amount = isDepr ?  newMaintenance.amount : value;
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

    componentDidUpdate(){
        if(this.props.focusing &&  this.inputName){
            // this.inputName.focus();
        }
    }

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
                <td className="p0">
                    {/* ================ _id ============== */}

                    { this.state.editable ? buttonSave() : null }
                    
                    <span style={{fontSize: "12px"}}>{_id._str}</span>
                </td>
                <td className="p0">
                    {/* ================ jobName ============== */}
                    {(() => {
                        if(this.state.editable){
                            return (
                                <textarea
                                    type="text"
                                    className="w90"
                                    onChange={(e) => this.onChangeJobName(e.target.value)}
                                    ref={(ref) => this.inputName = ref}
                                    value={jobName} 
                                    autoFocus>
                                </textarea>
                            )
                        } 

                        return <span>{jobName}</span>
                    })()}
                </td>
                <td className="p0">
                    {/* ================ description ============== */}
                    {(() => {
                        if(this.state.editable){
                            return (
                                <textarea 
                                    type="text"
                                    className="w90"
                                    onChange={(e) => this.onChangeDescription(e.target.value)}
                                    value={description} >
                                </textarea>
                            )
                        } 

                        return <span>{description}</span>
                    })()}
                </td>
                <td className="p0">
                    {/* ================ date ============== */}
                    {(() => {
                        if(this.state.editable){
                            return (
                                <DatePicker value={date}
                                            onChange={ this.onChangeDate } />
                            )
                        } 

                        return <span>{date}</span>
                    })()}
                </td>
                <td className="p0">
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
                <td className="p0">
                    {/* ================ amount ============== */}
                    {(() => {
                        if(this.state.editable){
                            return (
                                <input 
                                    type="number"
                                    min="0"
                                    max="99999"
                                    onChange={(e) => this.onChangeAmount(e.target.value)}
                                    value={amount} />
                            )
                        } 

                        return <span>{amount}</span>
                    })()}
                    
                </td>
                <td className="p0">
                    {/* ================ endDate ============== */}
                    {(() => {
                        if(this.state.editable){
                            return (
                                <DatePicker value={endDate}
                                            onChange={ this.onChangeEndDate } />
                            )
                        } 

                        return <span>{endDate}</span>
                    })()}
                </td>
            </tr>
        )
    }
}