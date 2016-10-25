import React, { Component, PropTypes } from 'react';
import { clone, map, reverse, cloneDeep, find, compact } from 'lodash';
import { createContainer } from 'meteor/react-meteor-data'

import { ApiCars } from '/imports/api/cars.js';
import { ApiLines } from '/imports/api/lines.js';
import TableHeadButtons from './TableHeadButtons.js';
import LineTabRow from './LineTabRow.js';

export default class LinesOnTab extends Component {
    constructor(props) {
        super(props); 

        this.state = {
            selectedListId: [],
            invoices: this.props.invoices,
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
        const lineId = new Mongo.ObjectID();

        ApiLines.insert({_id: lineId, customerId: this.props.invoice.customerId, dateCreate: now()});
        ApiInvoices.update(this.props.invoice._id, {$push: { linesId: lineId }});

        let selectedListId = this.state.selectedListId;
        selectedListId.push(lineId)

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
        const _id = clone(line._id);
        delete line._id;

        ApiLines.update(_id, {$set: line });

        let selectedListId = this.state.selectedListId;
        selectedListId.splice(selectedListId.indexOf(_id), 1);

        this.setState({ selectedListId });
    }
// END =================== ADD = EDIT = REMOVE = SAVE ======================

    render(){
        let lines = compact(this.props.lines);

        console.log('this.props.lines', this.props.lines);

        return(
            <div>
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            {(() => {
                                if (!this.props.readOnly) {
                                    return <th><input type="checkbox" disabled/></th>
                                }
                                return null;
                            })()}
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
                            if (lines) {
                                let inv = cloneDeep(this.props.invoices);
                                console.log('inv', this.props.invoices);
                                return (
                                    lines.map((item, key) => {
                                        let codeName = '';
                                        let invId = {};

                                        if (inv[0]) {
                                            invId = inv[0]._id;
                                            codeName = inv[0].codeName;
                                            inv[0].numb--;
                                            if (inv[0].numb === 0) inv.splice(0, 1);
                                        }
                                        
                                        return (
                                            <LineTabRow key={`line-${key}`}
                                                invId={invId}
                                                codeName={codeName}
                                                onSelect={this.changeSelectedItem.bind(null,item)}
                                                line={item}
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


export default createContainer(() => {
  Meteor.subscribe('cars');

  return {
    cars: ApiCars.find().fetch()
  };
}, LinesOnTab);