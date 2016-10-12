import React, { Component, PropTypes } from 'react';
import { map, find } from 'lodash';

export default class LineTabRow extends Component {
    constructor(props) {
        super(props); 

        this.state = {
            dispLine: this.props.line,
            isEdit: this.props.isEdit
        }

        this.onChangeAmount = this.onChangeAmount.bind(this);
    } 


    componentWillReceiveProps(nextProps){
        let dispLine = (!this.state.dispLine)
                                    ? nextProps.line 
                                    : this.state.dispLine

        const nextLine = nextProps.line ? nextProps.line._id._str : '';
        const isSelected = find(nextProps.selectedListId, {_str: nextLine});
        this.checkbox.checked = isSelected;

        const isEdit = (isSelected && nextProps.isEdit) ? true : false;

        this.setState({dispLine, isEdit});
    }

// ==================== CHANGERS FIELDS =============================
    onChangeAmount(value){
        let newLine = this.state.dispLine;
        newLine.amount = value;
        this.setState({dispLine: newLine});
    }
// END ================ CHANGERS FIELDS =============================


    render(){
        const line = this.props.line;
        let dispLine = this.state.dispLine;

        const buttonSave = () => {
            if (this.state.isEdit) {
                return (
                    <button
                        onClick={() => this.props.onSave(this.state.dispLine)}
                        className='btn btn-danger'>
                        Save
                    </button>
                )
            }

            return undefined;
        }

        const showDate = () => {
            if (this.state.isEdit){
                return(
                    <input  type="date"
                            value={dispPayment.date}
                            onChange={(e) => this.onChangeDate(e.target.value)} />
                )
            }

            return <span>{payment ? payment.date : ''}</span>
        }

        const showDateFrom = () => {
            if (this.state.isEdit){
                return(
                    <input  type="date"
                            value={dispLine.dateTo} />
                )
            }

            return <span>{line ? line.dateFrom : ''}</span>
        }
        const showDateTo = () => {
            if (this.state.isEdit){
                return(
                    <input  type="date"
                            value={dispLine.dateTo} />
                )
            }

            return <span>{line ? line.dateTo : ''}</span>
        }
        const showAmount = () => {
            if (this.state.isEdit){
                return(
                    <input  type="text"
                            value={dispLine.amount}
                            onChange={(e) => this.onChangeAmount(e.target.value)} />
                )
            }

            return <span>{line ? line.amount : ''}</span>
        }

        const showStatus = () => {
            if (this.state.isEdit) {
                return (
                  <div className='col-xs-8 form-horizontal'>
                    <select className=' form-control' onChange={(e) => this.onChangeStatus(e.target.value)}>
                      <option className='' value={this.state.dispPayment.status}>{this.state.dispPayment.status}</option>
                      {
                        paymentStateTypes.map((el, key) => {
                          if (el !== status) {
                              return (
                                <option key={key} value={el}>{el}</option>
                              )
                            }
                            return undefined;
                          }
                        )}
                    </select>
                  </div>
                )
            }

            return <span>{payment ? payment.status : ''}</span>
        }

        return(
            <tr className="LineTabRow">
                <th>
                    <input  type="checkbox" 
                            onChange={() => this.props.onSelect(line._id)}
                            ref={(ref) => this.checkbox = ref}/>
                </th>
                <td>
                    { buttonSave() }
                    { line ? line._id._str : '' }
                </td>
                <td>{ showDateFrom() }</td>
                <td>{ showDateTo() }</td>
                <td>{ showAmount() }</td>
            </tr>
        )
    }
}