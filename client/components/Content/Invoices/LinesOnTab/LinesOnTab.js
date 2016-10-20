import React, { Component, PropTypes } from 'react';
import { clone, map, reverse, cloneDeep, find, now } from 'lodash';
import { createContainer } from 'meteor/react-meteor-data'

import { ApiCars } from '/imports/api/cars.js';
import { ApiLines } from '/imports/api/lines.js';
import { ApiInvoices } from '/imports/api/invoices.js';
import { ApiRentals } from '/imports/api/rentals.js';
import TableHeadButtons from './TableHeadButtons.js';
import LineTabRow from './LineTabRow.js';

export default class LinesOnTab extends Component {
    constructor(props) {
        super(props); 

        this.state = {
            selectedListId: [],
            isEdit: false
        }

        this.changeSelectedItem = this.changeSelectedItem.bind(this);
        this.handleAddNewLine = this.handleAddNewLine.bind(this);
        this.handleEditLines = this.handleEditLines.bind(this);
        this.handleRemoveLines = this.handleRemoveLines.bind(this);
        this.handleSaveLine = this.handleSaveLine.bind(this);
    }   


    changeSelectedItem(itemId) {
        let selectedListId = this.state.selectedListId;
        let index = -1;

        map(selectedListId, (item, key) => {
            if (item._str == itemId._str) {
                index = key;
            }
        })


        if (index === -1) { selectedListId.push(itemId) }
        else { selectedListId.splice(index, 1); }

        let isEdit = this.state.isEdit;
        isEdit = !selectedListId.length ? false : isEdit;

        this.setState({selectedListId, isEdit});
    }

// ====================== ADD = EDIT = REMOVE = SAVE ======================
    handleAddNewLine(){
        const rentalId = new Mongo.ObjectID();
        ApiRentals.insert({_id: rentalId});


        const lineId = new Mongo.ObjectID();

        ApiLines.insert({_id: lineId, invoiceId: this.props.invoice._id, rentalId, dateCreate: now(), amount: '0'});
        ApiInvoices.update(this.props.invoice._id, {$push: { linesId:{ $each: [lineId], $position: 0}}});

        let selectedListId = this.state.selectedListId;
        selectedListId.push(lineId)


        const invoice = this.props.invoice;
        Meteor.users.update({_id: invoice.customerId}, {$push: { rentails: rentalId }});
        ApiInvoices.update({_id: invoice._id}, {$push: {rentals: rentalId}});
        this.setState({ selectedListId, isEdit: true });
    }

    handleEditLines(){
        this.setState({isEdit: !this.state.isEdit})
    }

    handleRemoveLines(){
        const invoice = this.props.invoice;
        
        map(this.state.selectedListId, (itemId, index) => {
            invoice.linesId.splice(invoice.linesId.indexOf(itemId), 1);
            ApiInvoices.update({_id: invoice._id}, {$pull: {linesId: itemId}})
            ApiLines.remove(itemId);
        })

        this.setState({selectedListId: [], isEdit: false});
    }

    handleSaveLine(line){
        const _id = line._id;
        delete line._id;

        ApiLines.update({_id: _id }, {$set: line });
        ApiRentals.update({_id: line.rentalId}, {$set: {car: line.car, customerId: this.props.invoice.customerId, dateFrom: line.dateFrom, dateTo: line.dateTo}});

        let selectedListId = this.state.selectedListId;
        selectedListId.splice(selectedListId.indexOf(line._id), 1);

        const isEdit = (selectedListId.length === 0) ? false : this.state.isEdit;

        this.setState({ selectedListId, isEdit });
    }
// END =================== ADD = EDIT = REMOVE = SAVE ======================

    render(){
        let lineListId = this.props.linesId;

        const RenderTableHeadButtons = () => {
            if (!this.props.readOnly) {
                return (
                    <TableHeadButtons 
                        selectedItems={this.state.selectedListId.length}
                        onAddNew={this.handleAddNewLine}
                        onEdit={this.handleEditLines}
                        onRemove={this.handleRemoveLines} />
                )
            }

            return null;
        }


        return(
            <div>
                { RenderTableHeadButtons() }

                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            { !this.props.readOnly ? (<th><input type="checkbox" disabled/></th>) : null }
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
                        {(() => {
                            if (lineListId) {
                                return (
                                    lineListId.map((item, key) => {
                                        return (
                                            <LineTabRow key={`line-${key}`}
                                                onSelect={this.changeSelectedItem.bind(null,item)}
                                                line={ApiLines.findOne({_id: item})}
                                                onSave={this.handleSaveLine}
                                                selectedListId={this.state.selectedListId}
                                                isEdit={this.state.isEdit}
                                                cars={this.props.cars}
                                                readOnly={this.props.readOnly}/>
                                        )
                                }))
                            }
                            return undefined
                        })()}
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
  router: React.PropTypes.object.isRequired
}


export default createContainer(() => {
  Meteor.subscribe('lines');
  Meteor.subscribe('cars');
  Meteor.subscribe('rentals');

  return {
    lines: ApiLines.find().fetch().reverse(),
    cars: ApiCars.find().fetch()
  };
}, LinesOnTab);