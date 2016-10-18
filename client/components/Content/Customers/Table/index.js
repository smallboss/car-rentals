/**
 * Created by watcher on 10/8/16.
 */
import React from 'react'
import { Link } from 'react-router'
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { ApiPayments } from '/imports/api/payments'

class Table extends React.Component {
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
            i,
            idCustomer,
            currentArray = [],
            _arrToDel = [],
            _arrToEdit = [],
            _arrNew = [],
            _source,
            _prop,
            _value,
            objToAdd = {}
        switch (_target) {
            case 'remove_notes':
                _arrToDel = this.state.arrChecked
                if(_arrToDel.length > 0) {
                    this.state.arrToTable.forEach(item => {
                        if(_arrToDel.indexOf(item._id._str) == -1) {
                            _arrNew.push(item)
                        } else {
                            if(this.props.currentComponent == 'payments') {
                                idCustomer = item.customerId
                                Meteor.users.update({_id: idCustomer}, {$pull: {'profile.payments': item._id}})
                                ApiPayments.remove({_id: item._id})
                            }
                        }
                    })
                    if(this.props.currentComponent !== 'payments') {
                        this.props.handlerChildState(this.props.currentComponent, _arrNew)
                    }
                    this.setState({arrToTable: _arrNew, arrChecked: []})
                }
                break
            case 'add_note':
                this.setState({addNewField: 1})
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
                _source = this._r_addNewField.children
                _arrNew = Object.keys(_source)
                if(this.state.addNewField && (_source[1].childNodes[0].value.length == 0 || _source[1].childNodes[0].value.length == 0 || _source[3].childNodes[0].value.length == 0)){
                    alert('Fields must be contained')
                    return false
                }
                _arrNew.forEach((key) => {
                    _prop = _source[key].childNodes[0].id
                    _value = _source[key].childNodes[0].value || ''
                    if (_prop) {
                        objToAdd[_prop] = _value
                    }
                })
                objToAdd._id = new Mongo.ObjectID()
                currentArray.unshift(objToAdd)
                this.props.handlerChildState(this.props.currentComponent, currentArray)
                this.setState({arrToTable: currentArray, addNewField: 0})
                break
            case 'save_notes':
                currentArray = this.state.arrToTable
                _arrToEdit = this.state.arrChecked
                //console.log(currentArray.filter((elem, i) => {console.log(elem); console.log(targetId);  if(elem._id._str == targetId){return i}})) 
                currentArray.forEach(elem => {
                    if (elem._id._str == targetId) {
                        delete elem._toedit
                    }
                })
                delete _arrToEdit[_arrToEdit.indexOf(targetId)]
                this.props.handlerChildState(this.props.currentComponent, currentArray)
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
    handlerInputs (target, e) {
        let _id = target,
            _name = e.target.name,
            _value = e.target.value,
            _curArr = this.state.arrToTable
        _curArr.forEach(elem => {
            if(elem._id._str == _id){
                elem[_name] = _value
            }
        })
        this.setState({arrToTable: _curArr})
    }
    render () {
        let classNameNewField = (!this.state.addNewField) ? 'hidden' : ''
        let _stateToTh = (this.state.arrToTable) ? Object.keys(this.state.arrToTable[0] || {}, key => obj[key]) : [];
        return (
            <div>
                <div className='row' ref={ref => {this._r_buttonArea = ref}}>
                    <input type='button' name='remove_notes' className='btn btn-danger' value='Remove notes' />
                    <input type='button' name='add_note' className='btn btn-success m-x-1 vis' value='Add note' />
                    <input type='button' name='edit_notes' className='btn btn-primary m-x-1' value='Edit notes' />
                </div>
                <table className='table table-hover table-bordered m-y-1'>
                    <thead>
                    <tr>
                        <th className='col-xs-1'>#</th>
                        {_stateToTh.map(prop => {
                            if(prop != '_id' && prop != '_toedit' && prop !== 'customerId') {
                                let replaceProp = prop.replace( /([A-Z])/g, (l) => {return ' ' + l.toUpperCase()}  )
                                replaceProp = replaceProp.charAt(0).toUpperCase() + replaceProp.slice(1)
                                return (
                                    <th key={Math.random()}>{replaceProp}</th>
                                )
                            }
                            if(this.props.currentComponent == 'payments' && prop == '_id') {
                                return (
                                    <th key={Math.random()}>Payment ID</th>
                                )
                            }
                        }) }
                    </tr>
                    </thead>
                    <tbody>
                    <tr key={Math.random()} className={classNameNewField} ref={ref => this._r_addNewField = ref}>
                        <td>#<input type='button' className='btn btn-success m-l-1' name='save_notes_new' value='Save' onClick={this.handlerEditButtons} /></td>
                        {_stateToTh.map(prop => {
                            let _typeInput = (prop.indexOf('date') != -1) ? 'date' : 'text',
                                _defaultValue = (prop == 'dateCreateRequest') ? new Date().toISOString().slice(0, 10) : ''
                            _defaultValue = (prop == 'status') ? 'open' : _defaultValue
                            if(this.props.currentComponent == 'payments' && prop == '_id') {
                                return (
                                    <td key={Math.random()}><input type={_typeInput} id={prop} className='form-control' value={new Mongo.ObjectID()} /></td>
                                )
                            }
                            if(prop == 'status') {
                                return (
                                    <td key={Math.random()} width='100'><select id='status' className='form-control'><option value='open' defaultValue>open</option><option value='close'>close</option></select></td>
                                )
                            }
                            if(prop != '_id' && prop != 'customerId' && prop != '_toedit') {
                                let maxLength = (prop == 'amount' || prop == 'phone') ? '15' : ''
                                return (
                                    <td key={Math.random()}><input type={_typeInput} id={prop} maxLength={maxLength} className='form-control' defaultValue={_defaultValue}/></td>
                                )
                            }
                        }) }
                    </tr>
                    {this.state.arrToTable.map((elem, i) => {
                        const elemId = elem._id._str
                        if(this.props.currentComponent == 'payments') {
                            console.log(elemId)
                            console.log(elem)
                        }
                        let _stateToTd = Object.keys(this.state.arrToTable[i], key => elem[key])
                        if(elem[_stateToTd[1]].length > 0) {
                            return (
                                <tr key={Math.random()}>
                                    <td><input type='checkbox' id={elemId} onChange={this.handlerChecker} />
                                        {(elem._toedit) ? <input key={Math.random()} type='button' className='btn btn-success m-l-1' name='save_notes' value='Save' onClick={(e) => {this.handlerEditButtons(e, elemId)}} /> : ''}
                                    </td>
                                    {_stateToTd.map(val => {
                                        if(typeof elem[val] == 'string' && val != 'customerId') {
                                            let _typeInput = (val.indexOf('date') != -1) ? 'date' : 'text'
                                            if(elem._toedit) {
                                                if(val == 'status') {
                                                    let selectOpen = (elem.status == 'open') ? true : false //not use defaultValue instead selected because defaultValue not boolean value
                                                    let selectClose = (elem.status == 'close') ? true : false //not use defaultValue instead selected because defaultValue not boolean value
                                                    return (
                                                        <td key={Math.random()} width='100'>
                                                            <select name='status' className='form-control' onChange={(e) => {this.handlerInputs(elem._id._str, e)}}>
                                                                <option value='open' selected={selectOpen}>Open</option>
                                                                <option value='close' selected={selectClose}>Close</option>
                                                            </select>
                                                        </td>
                                                    )
                                                }
                                                return (
                                                    <td key={Math.random()}>
                                                        <input type={_typeInput} className='form-control' name={val} defaultValue={elem[val]} onChange={(e) => {this.handlerInputs(elem._id._str, e)}} />
                                                    </td>
                                                )
                                            } else {
                                                return (
                                                    <td key={Math.random()}>
                                                        {elem[val]}
                                                    </td>
                                                )
                                            }
                                        } else if(this.props.currentComponent == 'payments' && val == '_id') {
                                            let href = '/managePanel/payments/' + elem._id._str
                                            return (
                                                <td key={Math.random()}>
                                                    <Link to={href}>{elem._id._str}</Link>
                                                </td>
                                            )
                                        }
                                    })}
                                </tr>
                            )
                        }
                    })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Table

