/**
 * Created by watcher on 10/8/16.
 */
import React from 'react'
import { Mongo } from 'meteor/mongo'

class Table extends React.Component {
    constructor (props) {
        super(props)
        let arrToTable = props.arrToTable || [] 
        this.state = {arrToTable, editAble: 0, addNewField: 0, arrChecked: []}
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
                        }
                    })
                    this.props.handlerChildState(this.props.currentComponent, _arrNew)
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
                if(this.state.addNewField && (_source[2].childNodes[0].value.length == 0 || _source[3].childNodes[0].value.length == 0 || _source[4].childNodes[0].value.length == 0)){
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
                currentArray.forEach(item => {
                    if(item._id._str == targetId) {
                        if(item._toedit) {
                            delete item._toedit                            
                        }
                        _arrToEdit = _arrToEdit.filter(elem => {
                            if(elem != item._id._str) {
                                return elem
                            }
                        })
                    }                    
                })                
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
        //console.log(this.state)
        let classNameNewField = (!this.state.addNewField) ? 'hidden' : ''
        let _stateToTh = Object.keys(this.state.arrToTable[0] || {}, key => obj[key])
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
                            <th className='col-xs-1'>Saving</th>
                            {_stateToTh.map(prop => {
                                if(prop != '_id' && prop != '_toedit') {
                                    return (
                                        <th key={Math.random()}>{prop}</th>
                                    )   
                                }                                
                            }) }
                        </tr>
                    </thead>
                    <tbody>
                    <tr key={Math.random()} className={classNameNewField} ref={ref => this._r_addNewField = ref}>
                        <td>#</td>
                        <td><input type='button' className='btn btn-success' name='save_notes_new' value='Save' onClick={this.handlerEditButtons} /></td>
                        {_stateToTh.map(prop => {
                            if(prop != '_id') {
                                return (
                                    <td key={Math.random()}><input type='text' id={prop} className='form-control' placeholder='Input new value' /></td>
                                )
                            }
                        }) }
                    </tr>
                        {this.state.arrToTable.map((elem, i) => {
                            let _stateToTd = Object.keys(this.state.arrToTable[i], key => elem[key])
                            if(elem[_stateToTd[1]].toString().length > 0) {
                                return (
                                    <tr key={Math.random()}>
                                        <td><input type='checkbox' id={elem._id._str} onChange={this.handlerChecker} /></td>
                                        {(elem._toedit) ? <td key={Math.random()}><input type='button' className='btn btn-success' name='save_notes' value='Save' onClick={(e) => {this.handlerEditButtons(e, elem._id._str)}} /></td> : <td></td>}
                                        {_stateToTd.map(val => {
                                            if(typeof elem[val] == 'string') {
                                                if(elem._toedit) {
                                                    return (
                                                        <td key={Math.random()}>
                                                            <input type='text' className='form-control' name={val} defaultValue={elem[val]} onChange={(e) => {this.handlerInputs(elem._id._str, e)}} />
                                                        </td>
                                                    )   
                                                } else {
                                                    return (
                                                        <td key={Math.random()}>
                                                            {elem[val]}
                                                        </td>
                                                    )   
                                                }                                                   
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

//if(this.state.arrToTable[0][_stateToTh[1]].length > 0 && _stateToTd.length > 0) {