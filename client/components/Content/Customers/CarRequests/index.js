/**
 * Created by watcher on 10/8/16.
 */
import React from 'react'
//import { Link } from 'react-router'
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

const DatePicker = require('react-bootstrap-date-picker')

class CarRequests extends React.Component {
    constructor (props) {
        super(props)
        this.state = {arrToTable: props.arrToTable || [], editAble: 0, addNewField: 0, arrChecked: []}
        this.handlerEditButtons = this.handlerEditButtons.bind(this)
        this.handlerChecker = this.handlerChecker.bind(this)
        this.handlerInputs = this.handlerInputs.bind(this)
    }
    componentWillReceiveProps(nextProps){
        this.setState({arrToTable: nextProps.arrToTable})
    }
    componentDidMount(){
        let _buttons = this._r_buttonArea.children
        Object.keys(_buttons).forEach(key => {
            _buttons[key].addEventListener('click', this.handlerEditButtons)
        })
    }
    shouldComponentUpdate (nextProps, nextState) {
        let _check = (nextState.arrChecked.length > 0 || this.state.arrChecked.length > 0) ? 0 : 1
        return _check
    }
    handlerEditButtons (e, targetId) {
        let _target = e.target.name,
            currentArray = [],
            _arrToDel = [],
            _arrToEdit = [],
            _arrNew = [],
            objToAdd = {}
        switch (_target) {
            case 'remove_notes':
                _arrToDel = this.state.arrChecked
                if(_arrToDel.length > 0) {
                    this.state.arrToTable.forEach(item => {
                        if(_arrToDel.indexOf(item._id._str) == -1) {
                            _arrNew.push(item)
                        }
                    })
                    this.saveDataHandler(_arrNew)
                    this.setState({arrToTable: _arrNew, arrChecked: []})
                }
                break
            case 'add_note':
                this.setState({addNewField: 1})
                this.forceUpdate()
                break
            case 'edit_notes':
                _arrToEdit = this.state.arrChecked
                _arrNew = this.state.arrToTable
                _arrNew.forEach((item, i) => {
                    if(_arrToEdit.indexOf(item._id._str) != -1) {
                        _arrNew[i]._toedit = 1
                    }
                })
                this.setState({arrToTable: _arrNew})
                this.forceUpdate()
                break
            case 'save_notes_new':
                currentArray = this.state.arrToTable
                objToAdd = {
                    _id: new Mongo.ObjectID(),
                    dateCreateRequest: this.rNewFieldDateCreateRequest.state.value.slice(0, 10),
                    dateFrom: this.rNewFieldDateFrom.state.value.slice(0, 10),
                    dateTo: this.rNewFieldDateTo.state.value.slice(0, 10),
                    requestText: this.rNewFieldRequestText.value
                }
                currentArray.unshift(objToAdd)
                this.saveDataHandler(currentArray)
                this.setState({arrToTable: currentArray, addNewField: 0})
                this.forceUpdate()
                break
            case 'save_notes':
                currentArray = this.state.arrToTable
                _arrToEdit = this.state.arrChecked
                currentArray.forEach(elem => {
                    if (elem._id._str == targetId) {
                        delete elem._toedit
                    }
                })
                delete _arrToEdit[_arrToEdit.indexOf(targetId)]
                this.saveDataHandler(currentArray)
                this.setState({arrToTable: currentArray, arrChecked: _arrToEdit})
                this.forceUpdate()
            default:
                break
        }
    }
    handlerChecker (e) {
        let _id = e.target.id,
            curArrChecked = this.state.arrChecked
        if(e.target.checked) {
            curArrChecked.push(_id)
        } else {
            curArrChecked = curArrChecked.filter(elem => {
                if(elem != _id){
                    return elem
                }
            })
        }
        this.setState({arrChecked: curArrChecked})
    }
    handlerInputs (target, name, newValue) {
        let _id = target,
            _curArr = this.state.arrToTable
        _curArr.forEach(elem => {
            if(elem._id._str == _id){
                elem[name] = newValue
            }
        })
        this.setState({arrToTable: _curArr})
    }
    saveDataHandler(data){
        let id = this.props.customerId
        Meteor.users.update({_id: id}, {$set: {'profile.carRequest': data}})
    }
    render () {
        let classNameNewField = (!this.state.addNewField) ? 'hidden' : ''
        //let _stateToTh = (this.state.arrToTable) ? Object.keys(this.state.arrToTable[0] || {}, key => obj[key]) : [];
        return (
            <div>
                <div className='row p-l-2' ref={ref => {this._r_buttonArea = ref}}>
                    <input type='button' name='remove_notes' className='btn btn-danger' value='Remove notes' />
                    <input type='button' name='add_note' className='btn btn-success m-x-1 vis' value='Add note' />
                    <input type='button' name='edit_notes' className='btn btn-primary m-x-1' value='Edit notes' />
                </div>
                <table className='table table-hover table-bordered m-y-1'>
                    <thead>
                    <tr>
                        <th className='col-xs-1'>#</th>
                        <th>Date Create Request</th>
                        <th>Date From</th>
                        <th>Date To</th>
                        <th>Request Text</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr key={Math.random()} className={classNameNewField} ref={ref => this._r_addNewField = ref}>
                        <td>#<input type='button' className='btn btn-success m-l-1' name='save_notes_new' value='Save' onClick={this.handlerEditButtons} /></td>
                        <td><DatePicker dateFormat='MM/DD/YYYY' value={new Date().toUTCString()} id='dateCreateRequest' ref={ref => {this.rNewFieldDateCreateRequest = ref}} disabled /></td>
                        <td><DatePicker dateFormat='MM/DD/YYYY' value={new Date().toUTCString()} id='dateFrom' ref={ref => {this.rNewFieldDateFrom = ref}} /></td>
                        <td><DatePicker dateFormat='MM/DD/YYYY' value={new Date().toUTCString()} id='dateTo' ref={ref => {this.rNewFieldDateTo = ref}} /></td>
                        <td><input type='text' id='requestText' className='form-control' ref={ref => {this.rNewFieldRequestText = ref}} /></td>                        
                    </tr>
                    {this.state.arrToTable.map((elem, i) => {
                        let { _id, _toedit, dateCreateRequest, dateFrom, dateTo, requestText } = elem
                        return (
                            <tr key={Math.random()}>
                                <td><input type='checkbox' id={_id._str} onChange={this.handlerChecker} />
                                    {(elem._toedit) ? <input key={Math.random()} type='button' className='btn btn-success m-l-1' name='save_notes' value='Save' onClick={(e) => {this.handlerEditButtons(e, _id._str)}} /> : ''}
                                </td>
                                {(_toedit) ? <td><DatePicker dateFormat='MM/DD/YYYY' value={dateCreateRequest} name='dateCreateRequest' disabled /></td> :
                                <td>{dateCreateRequest}</td>}
                                {(_toedit) ? <td><DatePicker dateFormat='MM/DD/YYYY' value={dateFrom} name='dateFrom' onChange={(val) => {this.handlerInputs(_id._str, 'dateFrom', val.slice(0, 10))}} /></td> :
                                <td>{dateFrom}</td>}
                                {(_toedit) ? <td><DatePicker dateFormat='MM/DD/YYYY' value={dateTo} name='dateTo' onChange={(val) => {this.handlerInputs(_id._str, 'dateTo', val.slice(0, 10))}} /></td> :
                                <td>{dateTo}</td>}
                                {(_toedit) ? <td><input className='form-control' name='requestText' defaultValue={requestText} onChange={(e) => {this.handlerInputs(_id._str, 'requestText', e.target.value)}} /></td> :
                                <td>{requestText}</td>}
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default CarRequests

