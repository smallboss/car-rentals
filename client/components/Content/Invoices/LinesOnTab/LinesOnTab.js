import React, { Component, PropTypes } from 'react';
import { clone, map, reverse, cloneDeep, find, now } from 'lodash';
import { createContainer } from 'meteor/react-meteor-data'

import { ApiCars } from '/imports/api/cars.js';
import { ApiLines } from '/imports/api/lines.js';
import { ApiInvoices } from '/imports/api/invoices.js';
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

        console.log('selectedListId', selectedListId);

        this.setState({selectedListId, isEdit});
    }

// ====================== ADD = EDIT = REMOVE = SAVE ======================
    handleAddNewLine(){
        console.log('now', now());
        // ApiLines.insert({_id: lineId, customerId: this.props.invoice.customerId, dateCreate: now()});
        const lineId = new Mongo.ObjectID();

        ApiLines.insert({_id: lineId, invoiceId: this.props.invoice._id, dateCreate: now()});
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

        this.setState({selectedListId: []});
    }

    handleSaveLine(line){
        const _id = clone(line._id);
        delete line._id;

        console.log('line', line)

        ApiLines.update(_id, {$set: line });

        let selectedListId = this.state.selectedListId;
        selectedListId.splice(selectedListId.indexOf(_id), 1);

        this.setState({ selectedListId });
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
                        onRemove={this.handleRemoveLines}/>
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
                                                line={clone(ApiLines.findOne({_id: item}))}
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

  return {
    lines: ApiLines.find().fetch().reverse(),
    cars: ApiCars.find().fetch()
  };
}, LinesOnTab);