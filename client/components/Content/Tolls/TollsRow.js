/**
 * Created by watcher on 10/19/16.
 */
import React from 'react'
import NumericInput from 'react-numeric-input'
const DatePicker = require('react-bootstrap-date-picker')

class TollsRow extends React.Component {
    constructor(props){
        super(props)
        this.state = {toll: props.toll || {}}
        this.handlerEditor = this.handlerEditor.bind(this)
    }
    componentWillReceiveProps (nextProps) {
        this.setState({toll: nextProps.toll})
    }
    handlerEditor(e) {
        let id = this.props.toll._id._str, 
            objToSend = {
                description: this.rEditFieldDescription.value,
                fineStatus: this.rEditFieldFineStatus.value,
                amount: this.rEditFieldAmount.state.value,
                fineSource: this.rEditFieldFineSource.value,
                fineTime: this.rEditFieldFineTime.value,
                fineDate: this.rEditFieldFineDate.state.value.slice(0, 10),
                fineId: this.rEditFieldFineId.value,
                licenseSource: this.rEditFieldLicenseSource.value,
                licenseNumber: this.rEditFieldLicenseNumber.value,
                plateSymbol: this.rEditFieldPlateSymbol.value,
                plateType: this.rEditFieldPlateType.value,
                plateNumber: this.rEditFieldPlateNumber.value
            }
        //ApiFines.update({_id: new Mongo.ObjectID(data.id)}, {$set: data.objToSend})
        this.props.handlerButtons(e, {id, objToSend})
        objToSend._id = Mongo.ObjectID(id)
        this.setState({toll: objToSend})
    }
    render () {
        let { _id, _toedit, description, fineStatus, amount, fineSource, fineTime, fineDate, fineId, licenseSource, licenseNumber, plateSymbol, plateType, plateNumber } = this.state.toll                        
        if(_toedit) {
            return (
                <tr>
                    <td><img className='pull-right img-save' src='/img/save.png' width='24' name='save-note' onClick={this.handlerEditor} /></td>
                    <td><input type='text' name='description' className='form-control' defaultValue={description} ref={ref => {this.rEditFieldDescription = ref}} /></td>
                    <td><input type='text' name='fineStatus' className='form-control' defaultValue={fineStatus} ref={ref => {this.rEditFieldFineStatus = ref}} /></td>
                    <td><NumericInput className='form-control' value={amount} ref={ref => {this.rEditFieldAmount = ref}} /></td>
                    <td><input type='text' name='fineSource' className='form-control' defaultValue={fineSource} ref={ref => {this.rEditFieldFineSource = ref}} /></td>
                    <td><input type='text' name='fineTime' className='form-control' value={fineTime} ref={ref => {this.rEditFieldFineTime = ref}} /></td>
                    <td><DatePicker dateFormat='MM/DD/YYYY' value={fineDate} ref={ref => {this.rEditFieldFineDate = ref}} /></td>
                    <td><input type='text' name='fineId' maxLength='15' className='form-control' defaultValue={fineId} ref={ref => {this.rEditFieldFineId = ref}} /></td>
                    <td><input type='text' name='licenseSource' className='form-control' defaultValue={licenseSource} ref={ref => {this.rEditFieldLicenseSource = ref}} /></td>
                    <td><input type='text' name='licenseNumber' maxLength='15' className='form-control' defaultValue={licenseNumber} ref={ref => {this.rEditFieldLicenseNumber = ref}} /></td>
                    <td><input type='text' name='plateSymbol' className='form-control' defaultValue={plateSymbol} ref={ref => {this.rEditFieldPlateSymbol = ref}} /></td>
                    <td><input type='text' name='plateType' className='form-control' defaultValue={plateType} ref={ref => {this.rEditFieldPlateType = ref}} /></td>
                    <td><input type='text' name='plateNumber' className='form-control' defaultValue={plateNumber} ref={ref => {this.rEditFieldPlateNumber = ref}} /></td>                                        
                </tr>
            )
        } else {
            return (
                <tr>
                    <td>{(_id) ? <input type='checkbox' onChange={(e) => {this.props.handlerChecker(e, _id._str)}} /> : ''}</td>
                    <td>{description}</td>
                    <td>{fineStatus}</td>
                    <td>{amount}</td>
                    <td>{fineSource}</td>
                    <td>{fineTime}</td>
                    <td>{fineDate}</td>
                    <td>{fineId}</td>
                    <td>{licenseSource}</td>
                    <td>{licenseNumber}</td>
                    <td>{plateSymbol}</td>
                    <td>{plateType}</td>
                    <td>{plateNumber}</td>
                </tr>
            )   
        }        
    }
}

export default TollsRow