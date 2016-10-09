import React, { Component, PropTypes } from 'react';
import { clone, map, find } from 'lodash';

import MaintenanceRow from './MaintenanceRow.js';


export default class TableOnTab extends Component {
    constructor(props, context) {
        super(props, context); 


        this.state = {
            selectedItems: [],
            allowEdit: false
        }


        this.onAddNew = this.onAddNew.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.onSaveMaintenance = this.onSaveMaintenance.bind(this);
        this.editListEditing = this.editListEditing.bind(this);
        this.onRemoveMaintenance = this.onRemoveMaintenance.bind(this);
    }   


    handleSelect(e, maintenance){
        let newSelectedMaintenance = this.state.selectedItems;
        

        let index = -1;

        newSelectedMaintenance.map((el, key) => {
            if (el._id == maintenance._id) {
                index = key;
            }
        })


        if (index === -1)
          newSelectedMaintenance.push(maintenance);
        else
          newSelectedMaintenance.splice(index, 1);

        const allowEdit = (!newSelectedMaintenance.length && this.state.allowEdit) 
                                ? false
                                : this.state.allowEdit


        this.setState({selectedItems: newSelectedMaintenance, allowEdit});
    }


    onAddNew(){

    }


    onEdit(){
        const cloneAllowEdit = clone(this.state.allowEdit);

        this.setState({allowEdit: !cloneAllowEdit});
    }

    componentDidUpdate(){
        if(this.buttonEdit) {
            this.buttonEdit.disabled =
            this.buttonRemove.disabled = !this.state.selectedItems.length;
        }
    }


    componentDidMount(){
        if(this.buttonEdit) {
            this.buttonEdit.disabled =
            this.buttonRemove.disabled = !this.state.selectedItems.length;
        }
    }

    onSaveMaintenance(maintenance){
        let newSelMaintenanceList = clone(this.state.selectedItems)


        newSelMaintenanceList.map((el, key) => {
            if (el._id == maintenance._id) {
                newSelMaintenanceList.splice(key, 1);
            }
        })


        const selectedItemsID = clone(this.state.selectedItemsID);
        this.props.onSaveMaintenance(maintenance, selectedItemsID);

        this.setState({selectedItems: newSelMaintenanceList});
    }


    editListEditing(newMaintenance){
        let newSelectedItems = clone(this.state.selectedItems);

        let index = -1;
        
        newSelectedItems.map((el, key) => {
            if (el._id == newMaintenance._id)
                index = key;
        })

        

        if (index !== -1) {
            newSelectedItems[index] = newMaintenance;
        } else {
            newSelectedItems.push(newMaintenance)
        }

        this.setState({selectedItems: newSelectedItems});
    }

    onRemoveMaintenance(){
        this.props.onRemove(clone(this.state.selectedItems));
        this.setState({selectedItems: []});
    }


    render(){
        const { selectedItems } = this.state;

        return (
            <div className="TableOnTab">
                <div>
                  <button
                    onClick={this.props.onAddNew}
                    ref={(ref) => this.buttonAdd = ref}
                    className='btn btn-primary'>
                    Add New
                  </button>
                  <button 
                    className="btn btn-warning" 
                    ref={(ref) => this.buttonEdit = ref}
                    onClick={this.onEdit}>
                    Edit
                  </button>
                  <button
                    onClick={this.onRemoveMaintenance}
                    ref={(ref) => this.buttonRemove = ref}
                    className='btn btn-danger'>
                    Delete
                  </button>
                </div>
                <table className="table table-bordered table-hover">
                  <thead>
                      <tr>
                        <th><input type="checkbox" disabled/></th>
                        <th>Job ID</th>
                        <th>Job Name</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>End Date</th>
                      </tr>
                  </thead>

                  <tbody>
                  { 

                    this.props.maintenanceList.map((item, key) => {
                        
                        let isInEditList = false;
                        let index = -1;

                        selectedItems.map((el, key) => {
                            if (el._id == item._id) {
                                isInEditList = true;
                                index = key;
                            }
                        })


                        const isEditable = (isInEditList && this.state.allowEdit) 
                                                ? true 
                                                : false

                        const pasteMaintenance = isInEditList ? clone(selectedItems[index]) 
                                                              : clone(item);

                        return (
                            <MaintenanceRow
                                key={`maintenance-${key}`}
                                editable={isEditable}
                                maintenance={pasteMaintenance}
                                onSave={(maintenance) => this.onSaveMaintenance(maintenance)}
                                onHandleSelect={this.handleSelect}
                                selectedMaintenance={selectedItems}
                                onEditingField={this.editListEditing}/>
                        )
                    })
                  }
                  </tbody>
                </table>
            </div>
        )
    }
}