/**
 * Created by watcher on 10/19/16.
 */
import React from 'react'
import NumericInput from 'react-numeric-input'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiTolls } from '/imports/api/tolls'
import { Mongo } from 'meteor/mongo'
import TollsRow from './TollsRow'
import './style.css'
const DatePicker = require('react-bootstrap-date-picker')

class Tolls extends React.Component {
    constructor (props, context) {
        super(props)
        this.state = {loginLevel: context.loginLevel, tolls: props.tolls || [], showModalTolls: 0, showNewField: 0, arrChecked: []}
        this.handlerButtons = this.handlerButtons.bind(this)
        this.handlerChecker = this.handlerChecker.bind(this)
    }
    componentWillReceiveProps(nextProps, nextContext) {
        let loginLevel = nextContext.loginLevel
        this.setState({tolls: nextProps.tolls, loginLevel})
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.showNewField) {
            return true
        }
        return (nextState.arrChecked.length > 0) ? 0 : 1
    }
    handlerButtons (e, data) {
        let nameE = e.target.name,
            newObj = {}
        switch (nameE) {
            case 'remove-notes':
                newObj = this.state.tolls
                this.state.arrChecked.forEach(id => {
                    newObj.forEach((elem) => {
                        if(elem._id._str == id){
                            ApiTolls.remove({_id: new Mongo.ObjectID(id)})
                        }
                    })
                })
                this.setState({arrChecked: []})
                break
            case 'edit-notes':
                newObj = this.state.tolls
                this.state.arrChecked.forEach(id => {
                    newObj.filter((elem) => {if(elem._id._str == id){elem._toedit = 1}})
                })
                //this.setState({tolls: newObj, arrChecked: []})
                this.setState({tolls: newObj})
                this.forceUpdate()
                break
            case 'save-note':
                newObj = this.state.arrChecked
                delete newObj[newObj.indexOf(data.id)]
                ApiTolls.update({_id: new Mongo.ObjectID(data.id)}, {$set: data.objToSend})
                this.setState({arrChecked: newObj})
                break
            case 'save-new-note':
                newObj = {
                    _id: new Mongo.ObjectID(),
                    description: this.rNewFieldDescription.value,
                    fineStatus: this.rNewFieldFineStatus.value,
                    amount: this.rNewFieldAmount.state.value,
                    fineSource: this.rNewFieldFineSource.value,
                    fineTime: this.rNewFieldFineTime.value,
                    fineDate: this.rNewFieldFineDate.state.value.slice(0, 10),
                    fineId: this.rNewFieldFineId.value,
                    licenseSource: this.rNewFieldLicenseSource.value,
                    licenseNumber: this.rNewFieldLicenseNumber.value,
                    plateSymbol: this.rNewFieldPlateSymbol.value,
                    plateType: this.rNewFieldPlateType.value,
                    plateNumber: this.rNewFieldPlateNumber.value
                }
                if(newObj.fineId.length == 0) {
                    alert('Field Fine ID and Fine Date must be contained')
                    break
                }
                ApiTolls.insert(newObj, (err, result) => {
                    if(err) {
                        alert(err)
                    } else {
                        alert('Note successfully added')
                        this.rNewFieldDescription.value = ''
                        this.rNewFieldFineStatus.value = ''
                        this.rNewFieldFineSource.value = ''
                        this.rNewFieldFineTime.value = ''
                        this.rNewFieldFineId.value = ''
                        this.rNewFieldLicenseSource.value = ''
                        this.rNewFieldLicenseNumber.value = ''
                        this.rNewFieldPlateSymbol.value = ''
                        this.rNewFieldPlateType.value = ''
                        this.rNewFieldPlateNumber.value = ''
                    }
                })
                this.setState({showNewField: 0})
                break
            default:
                break                
        }
    }
    handlerChecker (e, id) {
        let curArrChecked = this.state.arrChecked
        if(e.target.checked) {
            curArrChecked.push(id)
        } else {
            curArrChecked = curArrChecked.filter(elem => {
                if(elem != id){
                    return elem
                }
            })
        }
        this.setState({arrChecked: curArrChecked})
    }
    render () {
        let classModal = (this.state.showModalTolls) ? 'modal show' : 'modal fade',
            classNewField = (this.state.showNewField) ? '' : 'hidden',
            styleNumeric = {input: {textAlign: 'right'}},
            total = this.state.tolls.reduce(function(prev, cur, index, arr) {
                return prev + cur.amount
            }, 0)
        return (
            <div>
                <input type='button' className='btn btn-large btn-default' role='button' onClick={() => this.setState({showModalTolls: 1})} value='Show Tolls' />
                <span className='m-l-2'>{this.state.tolls.length} rows</span>
                <div id='tollsModal' className={classModal}>
                    <div className='overlay'></div>
                    <div className='modal-dialog modal-lg'>
                        <div className='modal-content p-a-1'>
                            <span className='close close-span' onClick={() => {this.setState({showModalTolls: 0, arrChecked: []}); this.forceUpdate()}}>x</span><br />
                            <div className='clearfix'></div>
                            <div className='row p-l-1 text-center'>
                                <div className='col-xs-5 text-left'>
                                    <input type='button' name='add-note' className='btn btn-success m-x-1 vis' value='Add note' onClick={() => {this.setState({showNewField: 1})}} />
                                    <input type='button' name='edit-notes' className='btn btn-primary m-x-1' value='Edit notes' onClick={this.handlerButtons} />
                                    {(this.state.loginLevel === 3) ? <input type='button' name='remove-notes' className='btn btn-danger' value='Remove notes' onClick={this.handlerButtons} /> : ''}
                                </div>
                                <div className='col-xs-2 text-center'>
                                    <span className='display-inherit'><h3>Tolls</h3></span>
                                </div>
                                <div className='col-xs-5'></div>
                            </div>
                            <table className='table table-hover table-bordered m-y-1'>
                                <thead>
                                <tr>
                                    <th className='' width='60'>#</th>
                                    <th className=''>Description</th>
                                    <th className=''>Fine Status</th>
                                    <th className=''>Amount</th>
                                    <th className=''>Fine Source</th>
                                    <th className=''>Fine Time</th>
                                    <th className=''>Fine Date</th>
                                    <th className=''>Fine ID</th>
                                    <th className=''>License Source</th>
                                    <th className=''>License Number</th>
                                    <th className=''>Plate Symbol</th>
                                    <th className=''>Plate Type</th>
                                    <th className=''>Plate Number</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr className={classNewField}>
                                    <td className=''>
                                        <img className='pull-right img-save' src='/img/save.png' width='24' name='save-new-note' onClick={this.handlerButtons} />
                                    </td>
                                    <td><input type='text' name='description' className='form-control' ref={ref => {this.rNewFieldDescription = ref}} /></td>
                                    <td><input type='text' name='fineStatus' className='form-control' ref={ref => {this.rNewFieldFineStatus = ref}} /></td>
                                    <td><NumericInput className='form-control' ref={ref => {this.rNewFieldAmount = ref}} /></td>
                                    <td><input type='text' name='fineSource' className='form-control' ref={ref => {this.rNewFieldFineSource = ref}} /></td>
                                    <td><input type='text' name='fineTime' className='form-control' value={new Date().toTimeString().slice(0, 8)} ref={ref => {this.rNewFieldFineTime = ref}} disabled /></td>
                                    <td><DatePicker dateFormat='MM/DD/YYYY' value={new Date().toUTCString()} ref={ref => {this.rNewFieldFineDate = ref}} disabled /></td>
                                    <td><input type='text' name='fineId' maxLength='15' className='form-control' ref={ref => {this.rNewFieldFineId = ref}} /></td>
                                    <td><input type='text' name='licenseSource' className='form-control' ref={ref => {this.rNewFieldLicenseSource = ref}} /></td>
                                    <td><input type='text' name='licenseNumber' maxLength='15' className='form-control' ref={ref => {this.rNewFieldLicenseNumber = ref}} /></td>
                                    <td><input type='text' name='plateSymbol' className='form-control' ref={ref => {this.rNewFieldPlateSymbol = ref}} /></td>
                                    <td><input type='text' name='plateType' className='form-control' ref={ref => {this.rNewFieldPlateType = ref}} /></td>
                                    <td><input type='text' name='plateNumber' className='form-control' ref={ref => {this.rNewFieldPlateNumber = ref}} value={this.props.plateNumber} disabled /></td>
                                </tr>
                                {this.state.tolls.map(elem => {
                                    return <TollsRow
                                        key={Math.random()}
                                        toll={elem}
                                        handlerChecker={this.handlerChecker}
                                        handlerButtons={this.handlerButtons}
                                    />
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Tolls.contextTypes = {
    loginLevel: React.PropTypes.number.isRequired
}

export default createContainer((params) => {
    Meteor.subscribe('tolls')
    return {
        tolls: ApiTolls.find({plateNumber: {$in: [params.plateNumber]}}).fetch()
    }
}, Tolls)