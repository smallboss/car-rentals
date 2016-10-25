/**
 * Created by watcher on 10/19/16.
 */
import React from 'react'
import NumericInput from 'react-numeric-input'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiFines } from '/imports/api/fines'
import { Mongo } from 'meteor/mongo'
import FinesRow from './FinesRow'
import './style.css'
const DatePicker = require('react-bootstrap-date-picker')

class Fines extends React.Component {
    constructor (props, context) {
        super(props)
        this.state = {loginLevel: context.loginLevel, fines: props.fines || [], showModalFines: 0, showNewField: 0, arrChecked: []}
        this.handlerButtons = this.handlerButtons.bind(this)
        this.handlerChecker = this.handlerChecker.bind(this)
    }
    componentWillReceiveProps(nextProps, nextContext) {
        let loginLevel = nextContext.loginLevel
        this.setState({fines: nextProps.fines, loginLevel})
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
                newObj = this.state.fines
                this.state.arrChecked.forEach(id => {
                    newObj.forEach((elem) => {
                        if(elem._id._str == id){
                            ApiFines.remove({_id: new Mongo.ObjectID(id)})
                        }
                    })
                })
                this.setState({arrChecked: []})
                break
            case 'edit-notes':
                newObj = this.state.fines
                this.state.arrChecked.forEach(id => {
                    newObj.filter((elem) => {if(elem._id._str == id){elem._toedit = 1}})
                })
                //this.setState({fines: newObj, arrChecked: []})
                this.setState({fines: newObj})
                this.forceUpdate()
                break
            case 'save-note':
                newObj = this.state.arrChecked
                delete newObj[newObj.indexOf(data.id)]
                ApiFines.update({_id: new Mongo.ObjectID(data.id)}, {$set: data.objToSend})
                this.setState({arrChecked: newObj})
                break
            case 'save-new-note':
                newObj = {
                    _id: new Mongo.ObjectID(),
                    transaction: this.rNewFieldTransaction.value,
                    time: this.rNewFieldTime.value,
                    postDate: this.rNewFieldDate.state.value.slice(0, 10),
                    plate: this.rNewFieldPlate.value,
                    source: this.rNewFieldSource.value,
                    tag: this.rNewFieldTag.value,
                    location: this.rNewFieldLocation.value,
                    direction: this.rNewFieldDirection.value,
                    amount: this.rNewFieldAmount.state.value
                }
                if(newObj.transaction.length == 0) {
                    alert('Field Transaction must be contained')
                    break
                }
                ApiFines.insert(newObj, (err, result) => {
                    if(err) {
                        alert(err)
                    } else {
                        alert('Note successfully added')
                        this.rNewFieldTransaction.value = ''
                        this.rNewFieldTime.value = ''
                        this.rNewFieldDate.state.value = ''
                        this.rNewFieldPlate.value = ''
                        this.rNewFieldSource.value = ''
                        this.rNewFieldTag.value = ''
                        this.rNewFieldLocation.value = ''
                        this.rNewFieldDirection.value = ''
                        this.rNewFieldAmount.state.value = ''
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
        let classModal = (this.state.showModalFines) ? 'modal show' : 'modal fade',
            classNewField = (this.state.showNewField) ? '' : 'hidden',
            styleNumeric = {input: {textAlign: 'right'}},
            total = +this.state.fines.reduce(function(prev, cur, index, arr) {
                return prev + +cur.amount
            }, 0).toFixed(2)
        return (
            <div>
                <input type='button' className='btn btn-large btn-default' role='button' onClick={() => this.setState({showModalFines: 1})} value='Show Fines' />
                <span className='m-l-2'>{this.state.fines.length} rows</span>
                <div id='finesModal' className={classModal}>
                    <div className='overlay'></div>
                    <div className='modal-dialog modal-lg'>
                        <div className='modal-content p-a-1'>
                            <span className='close close-span' onClick={() => {this.setState({showModalFines: 0, arrChecked: []}); this.forceUpdate()}}>x</span><br />
                            <div className='clearfix'></div>
                            <div className='row p-l-1 text-center'>
                                <div className='col-xs-4 text-left'>
                                    <input type='button' name='add-note' className='btn btn-success m-x-1 vis' value='Add note' onClick={() => {this.setState({showNewField: 1})}} />
                                    <input type='button' name='edit-notes' className='btn btn-primary m-x-1' value='Edit notes' onClick={this.handlerButtons} />
                                    {(this.state.loginLevel === 3) ? <input type='button' name='remove-notes' className='btn btn-danger' value='Remove notes' onClick={this.handlerButtons} /> : ''}
                                </div>
                                <div className='col-xs-4 text-center'>
                                    <span className='display-inherit'><h3>Fines</h3></span>
                                </div>
                                <div className='col-xs-4'></div>
                            </div>
                            <table className='table table-hover table-bordered m-y-1'>
                                <thead>
                                <tr>
                                    <th className='' width='60'>#</th>
                                    <th className=''>Trxn</th>
                                    <th className=''>Time</th>
                                    <th className=''>Post Date</th>
                                    <th className=''>Plate #</th>
                                    <th className=''>Source</th>
                                    <th className=''>Tag #</th>
                                    <th className=''>Location</th>
                                    <th className=''>Direction</th>
                                    <th className='' width='100'>Amount(AED)</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr className={classNewField}>
                                    <td className=''>
                                        <img className='pull-right img-save' src='/img/save.png' width='24' name='save-new-note' onClick={this.handlerButtons} />
                                    </td>
                                    <td><input type='text' name='transaction' className='form-control' ref={ref => {this.rNewFieldTransaction = ref}} /></td>
                                    <td><input type='text' name='time' className='form-control' value={new Date().toTimeString().slice(0,8)} ref={ref => {this.rNewFieldTime = ref}} disabled /></td>
                                    <td><DatePicker dateFormat='MM/DD/YYYY' value={new Date().toUTCString()} ref={ref => {this.rNewFieldDate = ref}} disabled /></td>
                                    <td><input type='text' name='plate' className='form-control' ref={ref => {this.rNewFieldPlate = ref}} value={this.props.plateNumber} disabled /></td>
                                    <td><input type='text' name='source' className='form-control' ref={ref => {this.rNewFieldSource = ref}} /></td>
                                    <td><input type='text' name='tag' className='form-control' ref={ref => {this.rNewFieldTag = ref}} /></td>
                                    <td><input type='text' name='location' className='form-control' ref={ref => {this.rNewFieldLocation = ref}} /></td>
                                    <td><input type='text' name='direction' className='form-control' ref={ref => {this.rNewFieldDirection = ref}} /></td>
                                    <td><NumericInput className='form-control' style={styleNumeric} step={0.01} precision={2} value={0.00} ref={ref => {this.rNewFieldAmount = ref}} /></td>
                                </tr>
                                {this.state.fines.map(elem => {
                                    return <FinesRow
                                        key={Math.random()}
                                        fine={elem}
                                        handlerChecker={this.handlerChecker}
                                        handlerButtons={this.handlerButtons}
                                    />
                                })}
                                <tr>
                                    <td><span className='font-weight-bold'>Total:</span></td>
                                    <td colSpan='8'></td>
                                    <td><span className='pull-right font-weight-bold'>{total}</span></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Fines.contextTypes = {
    loginLevel: React.PropTypes.number.isRequired
}

export default createContainer((params) => {
    Meteor.subscribe('fines')
    return {
        fines: ApiFines.find({plate: {$in: [params.plateNumber]}}).fetch()
    }
}, Fines)