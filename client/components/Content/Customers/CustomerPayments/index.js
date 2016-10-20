/**
 * Created by watcher on 10/19/16.
 */
import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiPayments } from '/imports/api/payments'
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import PaymentsRow from './PaymentsRow'
import './style.css'
import NumericInput from 'react-numeric-input'
const DatePicker = require('react-bootstrap-date-picker')

class CustomerPayments extends React.Component {
    constructor (props) {
        super(props)
        this.state = {payments: props.payments || [], showNewField: 0, arrChecked: []}
        this.handlerButtons = this.handlerButtons.bind(this)
        this.handlerChecker = this.handlerChecker.bind(this)
    }
    componentWillReceiveProps(nextProps) {
        this.setState({payments: nextProps.payments})
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.arrChecked.length > 0) ? 0 : 1
    }
    handlerButtons (e, data) {
        let nameE = e.target.name,
            newObj = {}
        switch (nameE) {
            case 'remove-notes':
                newObj = this.state.payments
                this.state.arrChecked.forEach(id => {
                    newObj.forEach((elem) => {
                        if(elem._id._str == id){
                            Meteor.users.update({_id: this.props.customerId}, {$pull: {'profile.payments': elem._id}})
                            ApiPayments.remove({_id: new Mongo.ObjectID(id)})
                        }
                    })
                })
                this.setState({arrChecked: []})
                break
            case 'edit-notes':
                newObj = this.state.payments
                this.state.arrChecked.forEach(id => {
                    newObj.filter((elem) => {if(elem._id._str == id){elem._toedit = 1}})
                })
                //this.setState({fines: newObj, arrChecked: []})
                this.setState({payments: newObj})
                this.forceUpdate()
                break
            case 'save-note':
                newObj = this.state.arrChecked
                delete newObj[newObj.indexOf(data.id)]
                ApiPayments.update({_id: new Mongo.ObjectID(data.id)}, {$set: data.objToSend})
                this.setState({arrChecked: newObj})
                break
            case 'save-new-note':
                newObj = {
                    _id: new Mongo.ObjectID(),
                    amount: this.rNewFieldAmount.state.value,
                    customerId: this.props.customerId,
                    codeName: this.rNewFieldCodeName.value,
                    date: this.rNewFieldDate.state.value.slice(0, 10),
                    status: this.rNewFieldStatus.value
                }
                if(newObj.codeName.length == 0) {
                    alert('Field Code Name must be contained')
                    break
                }
                ApiPayments.insert(newObj, (err, result) => {
                    if(err) {
                        alert(err)
                    } else {
                        Meteor.users.update({_id: this.props.customerId}, {$push: {'profile.payments': newObj._id}})
                        alert('Note successfully added')
                        this.rNewFieldCodeName.value = ''
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
        let classNewField = (this.state.showNewField) ? '' : 'hidden'            
        return (
            <div>
                <div className='row p-l-1 text-center'>
                    <div className='col-xs-5'>
                        <input type='button' name='remove-notes' className='btn btn-danger' value='Remove notes' onClick={this.handlerButtons} />
                        <input type='button' name='add-note' className='btn btn-success m-x-1 vis' value='Add note' onClick={() => {this.setState({showNewField: 1})}} />
                        <input type='button' name='edit-notes' className='btn btn-primary m-x-1' value='Edit notes' onClick={this.handlerButtons} />
                    </div>
                    <div className='col-xs-2 text-center'>
                        <span className='display-inherit'><h3></h3></span>
                    </div>
                    <div className='col-xs-5'></div>
                </div>
                <table className='table table-hover table-bordered m-y-1'>
                    <thead>
                    <tr>
                        <th className='' width='60'>#</th>
                        <th className=''>Payment ID</th>
                        <th className=''>Code Name</th>
                        <th className=''>Amount</th>
                        <th className=''>Date</th>
                        <th className=''>Status</th>                        
                    </tr>
                    </thead>
                    <tbody>
                    <tr className={classNewField}>
                        <td className=''>
                            <img className='pull-right img-save' src='/img/save.png' width='24' name='save-new-note' onClick={this.handlerButtons} />
                        </td>
                        <td><input type='text' name='id' className='form-control' disabled /></td>
                        <td><input type='text' name='codeName' className='form-control' ref={ref => {this.rNewFieldCodeName = ref}} /></td>
                        <td><NumericInput name='amount' className='form-control' ref={ref => {this.rNewFieldAmount = ref}} /></td>
                        <td><DatePicker dateFormat='MM/DD/YYYY' value={new Date().toUTCString()} ref={ref => {this.rNewFieldDate = ref}} /></td>
                        <td width='100'><select id='status' className='form-control' ref={ref => {this.rNewFieldStatus = ref}} ><option value='open' defaultValue>open</option><option value='close'>close</option></select></td>                        
                    </tr>
                    {this.state.payments.map(elem => {
                        return <PaymentsRow
                            key={Math.random()}
                            payment={elem}
                            handlerChecker={this.handlerChecker}
                            handlerButtons={this.handlerButtons}
                        />
                    })}                    
                    </tbody>
                </table>
            </div>
        )
    }
}

export default CustomerPayments

/*export default createContainer(() => {
    Meteor.subscribe('fines')
    return {
        fines: A.find().fetch()
    }
}, CustomerPayments)*/