/**
 * Created by watcher on 10/19/16.
 */
import React from 'react'
import NumericInput from 'react-numeric-input'
const DatePicker = require('react-bootstrap-date-picker')

class FinesRow extends React.Component {
    constructor(props){
        super(props)
        this.state = {fine: props.fine || {}}
        this.handlerEditor = this.handlerEditor.bind(this)
    }
    componentWillReceiveProps (nextProps) {
        this.setState({fine: nextProps.fine})
    }
    handlerEditor(e) {
        let id = this.props.fine._id._str, 
            objToSend = {
                transaction: this.rEditFieldTransaction.value,
                time: this.props.fine.time,
                postDate: this.rEditFieldDate.state.value.slice(0, 10),
                plate: this.rEditFieldPlate.value,
                source: this.rEditFieldSource.value,
                tag: this.rEditFieldTag.value,
                location: this.rEditFieldLocation.value,
                direction: this.rEditFieldDirection.value,
                amount: this.rEditFieldAmount.state.value
            }
        //ApiFines.update({_id: new Mongo.ObjectID(data.id)}, {$set: data.objToSend})
        this.props.handlerButtons(e, {id, objToSend})
        objToSend._id = Mongo.ObjectID(id)
        this.setState({fine: objToSend})
    }
    render () {
        let { _id, _toedit, transaction, time, postDate, plate, source, tag, location, direction, amount } = this.state.fine,
            styleNumeric = {input: {textAlign: 'right'}}            
        if(_toedit) {
            return (
                <tr>
                    <td><img className='pull-right img-save' src='/img/save.png' width='24' name='save-note' onClick={this.handlerEditor} /></td>
                    <td><input className='form-control' defaultValue={transaction} ref={ref => {this.rEditFieldTransaction = ref}} /></td>
                    <td>{time}</td>
                    <td><DatePicker dateFormat='MM/DD/YYYY' value={postDate} ref={ref => {this.rEditFieldDate = ref}} /></td>
                    <td><input className='form-control' defaultValue={plate} ref={ref => {this.rEditFieldPlate = ref}} /></td>
                    <td><input className='form-control' defaultValue={source} ref={ref => {this.rEditFieldSource = ref}} /></td>
                    <td><input className='form-control' defaultValue={tag}  ref={ref => {this.rEditFieldTag = ref}} /></td>
                    <td><input className='form-control' defaultValue={location} ref={ref => {this.rEditFieldLocation = ref}} /></td>
                    <td><input className='form-control' defaultValue={direction} ref={ref => {this.rEditFieldDirection = ref}} /></td>
                    <td><NumericInput className='form-control' style={styleNumeric} step={0.01} precision={2} value={amount}  ref={ref => {this.rEditFieldAmount = ref}} /></td>                    
                </tr>
            )
        } else {
            return (
                <tr>
                    <td>{(_id) ? <input type='checkbox' onChange={(e) => {this.props.handlerChecker(e, _id._str)}} /> : ''}</td>
                    <td>{transaction}</td>
                    <td>{time}</td>
                    <td>{postDate}</td>
                    <td>{plate}</td>
                    <td>{source}</td>
                    <td>{tag}</td>
                    <td>{location}</td>
                    <td>{direction}</td>
                    <td className='text-right'>{amount}</td>
                </tr>
            )   
        }        
    }
}

export default FinesRow