import React, { Component, PropTypes } from 'react';
import { clone, map, reverse, cloneDeep, find, now } from 'lodash';
import { createContainer } from 'meteor/react-meteor-data'

import { ApiCars } from '/imports/api/cars.js';
import { ApiLines } from '/imports/api/lines.js';
import { ApiInvoices } from '/imports/api/invoices.js';
import { ApiRentals, removeRental } from '/imports/api/rentals.js';
import TableHeadButtons from './TableHeadButtons.js';
import LineTabRow from './LineTabRow.js';

export class LinesOnTab extends Component {
    constructor(props, context) {
        super(props, context); 

        this.state = {
            loginLevel: context.loginLevel,
            selectedListId: [],
            isEdit: false,
            selectedAll: false
        }

        this.changeSelectedItem = this.changeSelectedItem.bind(this);
        this.handleAddNewLine = this.handleAddNewLine.bind(this);
        this.handleEditLines = this.handleEditLines.bind(this);
        this.handleRemoveLines = this.handleRemoveLines.bind(this);
        this.handleSaveLine = this.handleSaveLine.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
    }   


    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({ loginLevel: nextContext.loginLevel})
    }


    handleSelectAll(){
        let { selectedAll, isEdit } = this.state;
        isEdit = selectedAll ? false : isEdit;


        let linesId = this.props.isNew ? [] : this.props.linesId

        if (this.props.isNew) {
            this.props.storageLines.map((el) => {
                linesId.push(el._id);
            })
        }

        const selectedListId = selectedAll ? [] : cloneDeep(linesId);

        this.selectAll.checked = !selectedAll;
        this.setState({selectedListId, selectedAll: !selectedAll, isEdit});
    }


    changeSelectedItem(itemId) {
        let selectedListId = this.state.selectedListId;
        let index = -1;
        let currentSelectedAll = this.state.selectedAll;

        map(selectedListId, (item, key) => {
            if (item._str == itemId._str) {
                index = key;
            }
        })


        if (index === -1) { selectedListId.push(itemId) }
        else { selectedListId.splice(index, 1); }

        let isEdit = this.state.isEdit;
        isEdit = !selectedListId.length ? false : isEdit;

        if (currentSelectedAll || !selectedListId.length) {
          currentSelectedAll = false;
          this.selectAll.checked = currentSelectedAll;
        }

        this.setState({selectedListId, isEdit, selectedAll: currentSelectedAll});
    }

// ====================== ADD = EDIT = REMOVE = SAVE ======================
    handleAddNewLine(){
        const rentalId = new Mongo.ObjectID();
        const lineId = new Mongo.ObjectID();

        if (this.props.isNew) {
            const newLine = {
                _id: lineId,
                rentalId,
                amount: '0'
            }

            this.props.onAddNewLine(newLine);
        } else {

            ApiRentals.insert({_id: rentalId});
            ApiLines.insert({_id: lineId, invoiceId: this.props.invoice._id, rentalId, amount: '0'});
            ApiInvoices.update(this.props.invoice._id, {$push: { linesId: lineId }});

            const invoice = this.props.invoice;
            Meteor.users.update({_id: invoice.customerId}, {$push: { 'profile.rentals': rentalId }});
            ApiInvoices.update({_id: invoice._id}, {$push: {rentals: rentalId}});
        }

        let selectedListId = this.state.selectedListId;
            selectedListId.push(lineId);

        // this.props.pullLineId(lineId);

        this.setState({ selectedListId, isEdit: true});
    }


    handleEditLines(){
        this.setState({isEdit: !this.state.isEdit})
    }


    handleRemoveLines(){
        if (this.props.isNew) {
            this.props.onDeleteLines(this.state.selectedListId);
        } else {
            const invoice = this.props.invoice;
        
            map(this.state.selectedListId, (itemId, index) => {
                const line = find(this.props.lines, {_id: itemId});
                if (line) removeRental(line.rentalId);
                invoice.linesId.splice(invoice.linesId.indexOf(itemId), 1);
                ApiInvoices.update({_id: invoice._id}, {$pull: {linesId: itemId}})
                ApiLines.remove(itemId);
            })
        }

        this.selectAll.checked = false;
        this.setState({selectedListId: [], isEdit: false, selectedAll: false});
    }


    handleSaveLine(line){
        const oldLine = ApiLines.findOne({_id: line._is});
        let selectedListId = this.state.selectedListId;
        let index = -1;

        if (this.props.isNew) {
            this.props.onSaveLine(line)

            selectedListId.map((el, key) => {
                if (el._str == line._id._str) {
                    index = key;
                }
            })
        } else {
            const _id = line._id;
            delete line._id;

            ApiLines.update({_id: _id }, {$set: line });
            const car = find(this.props.cars, ['_id', line.car]);
            ApiRentals.update({_id: line.rentalId}, {$set: {car: line.car, 
                                                            customerId: this.props.invoice.customerId, 
                                                            dateFrom: line.dateFrom, 
                                                            dateTo: line.dateTo,
                                                            plateNumber: car ? car.plateNumber : ''
                                                        }});


            selectedListId.map((el, key) => {
                if (el._str == _id._str) {
                    index = key;
                }
            })
        }


        selectedListId.splice(index, 1);

        const isEdit = (selectedListId.length === 0) ? false : this.state.isEdit;

        this.selectAll.checked = false;
        this.setState({ selectedListId, isEdit, selectedAll: false });
    }
// END =================== ADD = EDIT = REMOVE = SAVE ======================

    render(){
        let lineListId = this.props.linesId;
        let totalAmount = 0;

        const RenderTableHeadButtons = () => {
            if (!this.props.readOnly) {
                return (
                    <TableHeadButtons 
                        selectedItems={this.state.selectedListId.length}
                        onAddNew={this.handleAddNewLine}
                        onEdit={this.handleEditLines}
                        onRemove={this.handleRemoveLines}
                        loginLevel={this.state.loginLevel} />
                )
            }

            return null;
        }


        const renderRows = () => {
            if (lineListId && this.props.isNew === false) {
                return (
                    lineListId.map((item, key) => {
                        // const line = ApiLines.findOne({_id: item});
                        const line = find(this.props.lines, {_id: item});
                        if (!line) {return null}
                        totalAmount += parseInt(line.amount);
                        return (
                            <LineTabRow key={`line-${key}`}
                                onSelect={this.changeSelectedItem.bind(null,item)}
                                line={ line }
                                onSave={this.handleSaveLine}
                                selectedListId={this.state.selectedListId}
                                isEdit={this.state.isEdit}
                                cars={this.props.cars}
                                readOnly={this.props.readOnly} />
                        )
                    })
                )
            }

            if (this.props.isNew) {
                return (
                    this.props.storageLines.map((line, key) => {
                        totalAmount += parseInt(line.amount);
                        return (
                            <LineTabRow key={`line-${key}`}
                                onSelect={this.changeSelectedItem.bind(null,line._id)}
                                line={ line }
                                onSave={this.handleSaveLine}
                                selectedListId={this.state.selectedListId}
                                isEdit={this.state.isEdit}
                                cars={this.props.cars}
                                readOnly={this.props.readOnly} />
                        )
                    })
                )
            }

            return undefined
        }


        const renderHeadCheckBox = () => {
            if (!this.props.readOnly ){
                if (this.props.storageLines.length || lineListId.length) {
                    return (
                      <th className="noPrint">
                        <input type="checkbox" 
                               ref={(ref) => this.selectAll = ref}
                               onChange={this.handleSelectAll} />
                      </th>
                    )
                }
                else {
                    return (
                      <th className="noPrint">
                        <input type="checkbox" disabled />
                      </th>
                    )
                }
            }

          return null;
        }


        return(
            <div>
                { RenderTableHeadButtons() }

                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            { renderHeadCheckBox() }
                            <th>Item</th>
                            <th>Description</th>
                            <th>Car plate#</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Period</th>
                            <th>Amount</th>
                        </tr>
                    </thead>

                    <tbody>

                        { renderRows() }

                        <tr style={{border: '1px solid white', backgroundColor: 'white'}}>
                            {(() => { 
                                if (!this.props.readOnly) 
                                    return <td style={{border: '1px solid white'}} className="noPrint"></td>

                                return null;
                            })()}
                            <td style={{border: '1px solid white'}}></td>
                            <td style={{border: '1px solid white'}}></td>
                            <td style={{border: '1px solid white'}}></td>
                            <td style={{border: '1px solid white'}}></td>
                            <td style={{border: '1px solid white'}}></td>
                            <td style={{border: '1px solid white'}}><b>Total amount:</b></td>
                            <td style={{border: '1px solid white'}}><b>{ totalAmount }</b></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

LinesOnTab.propTypes = {
  lines: PropTypes.array.isRequired,
};

LinesOnTab.contextTypes = {
  router: React.PropTypes.object.isRequired,
  loginLevel: React.PropTypes.number.isRequired
}


export default createContainer(() => {
  Meteor.subscribe('lines');
  Meteor.subscribe('cars');
  Meteor.subscribe('rentals');

  return {
    lines: ApiLines.find().fetch(),
    cars: ApiCars.find().fetch()
  };
}, LinesOnTab);