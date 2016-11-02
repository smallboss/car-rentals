import React, { Component, PropTypes } from 'react';
import { clone, map, reverse, cloneDeep } from 'lodash';

import MaintenanceRow from './MaintenanceRow.js';


export default class TableOnTab extends Component {
    constructor(props, context) {
        super(props, context); 


        this.state = {
            maintenanceList: reverse(clone(this.props.maintenanceList)),
            selectedItems: [],
            allowEdit: false,
            selectedAll: false
        }

        this.onEdit = this.onEdit.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.onSaveMaintenance = this.onSaveMaintenance.bind(this);
        this.editListEditing = this.editListEditing.bind(this);
        this.onRemoveMaintenance = this.onRemoveMaintenance.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
    }   


    handleSelectAll(){
        let { selectedAll } = this.state;
        const selectedItems  = selectedAll ? [] : cloneDeep(this.state.maintenanceList);

        // console.log(this.state.maintenanceList, selectedAll);

        this.selectAll.checked = !selectedAll;
        this.setState({selectedItems, selectedAll: !selectedAll});
    }


    handleSelect(e, maintenance){
        console.log('maintenance', maintenance);
        let newSelectedMaintenance = this.state.selectedItems;
        let currentSelectedAll = this.state.selectedAll;

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


        if (currentSelectedAll || !newSelectedMaintenance.length) {
          currentSelectedAll = false;
          this.selectAll.checked = currentSelectedAll;
        }


        this.setState({
            selectedItems: newSelectedMaintenance, 
            allowEdit, 
            electedAll: currentSelectedAll
        });
    }


    componentWillReceiveProps(nextProps){
        let newAllowEdit = this.state.allowEdit;

        if (this.state.maintenanceList.length+1 == nextProps.maintenanceList.length) {
            let newSelectedItems = clone(this.state.selectedItems);
            newSelectedItems.push(clone(nextProps.maintenanceList[nextProps.maintenanceList.length-1]));
            newAllowEdit = true;


            this.setState({
                maintenanceList: reverse(clone(nextProps.maintenanceList)),
                selectedItems: newSelectedItems,
                allowEdit: newAllowEdit
            })
        }


        this.setState({
            maintenanceList: reverse(clone(nextProps.maintenanceList)),
            allowEdit: newAllowEdit
        })
    }


    onEdit(){
        const cloneAllowEdit = clone(this.state.allowEdit);

        this.setState({allowEdit: !cloneAllowEdit});
    }

    componentDidUpdate(){
        if(this.buttonEdit) {
            this.buttonEdit.disabled = !this.state.selectedItems.length;
            if (this.buttonRemove) this.buttonRemove.disabled = !this.state.selectedItems.length;
        }
    }


    componentDidMount(){
        if(this.buttonEdit) {
            this.buttonEdit.disabled =!this.state.selectedItems.length;
            if (this.buttonRemove) this.buttonRemove.disabled = !this.state.selectedItems.length;
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

        const newAllowEdit = (newSelMaintenanceList.length) 
                                ? this.state.allowEdit
                                : false

        this.setState({
            selectedItems: newSelMaintenanceList, 
            allowEdit: newAllowEdit
        });

        this.props.onSaveMaintenance(maintenance, selectedItemsID);
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
        
        const t = clone(this.state.selectedItems);
        this.props.onRemove(t);
        
        this.setState({selectedItems: []});
    }


    render(){
        const { selectedItems, allowEdit } = this.state;


        console.log('selectedItems', selectedItems);

        selectedItems.map((el) => {
            console.log('el', el);
        })

        
        const renderBtnRemove = () => {
            if (this.props.loginLevel === 3) {
                return (
                    <button
                        onClick={this.onRemoveMaintenance}
                        ref={(ref) => this.buttonRemove = ref}
                        style={{margin: '10px'}}
                        className=' m-1 btn btn-danger'>
                        Delete
                    </button>
                )
            }

            return null;
        }


        const renderHeadCheckBox = () => {
            if (!this.props.readOnly ){
                return (
                  <th className="noPrint">
                    <input type="checkbox" 
                           ref={(ref) => this.selectAll = ref}
                           onChange={this.handleSelectAll} />
                  </th>
                )
            }

          return null;
        }


        return (
            <div className="TableOnTab">
                <div>
                  <button
                    onClick={this.props.onAddNew}
                    ref={(ref) => this.buttonAdd = ref}
                    style={{margin: '10px'}}
                    className=' m-1 btn btn-primary'>
                    Add New
                  </button>
                  <button 
                    className=" m-1 btn btn-warning"
                    ref={(ref) => this.buttonEdit = ref}
                    style={{margin: '10px'}}
                    onClick={this.onEdit}>
                    Edit
                  </button>
                  { renderBtnRemove() }
                </div>
                <table className="table table-bordered table-hover vertMiddle min">
                  <thead>
                      <tr>
                        { renderHeadCheckBox() }
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

                    this.state.maintenanceList.map((item, key) => {
                        
                        let isInEditList = false;
                        let index = -1;

                        selectedItems.map((el, key) => {
                            if (el._id._str == item._id._str) {
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
                                onEditingField={this.editListEditing}
                                focusing={!key}/>
                        )
                    })
                  }
                  </tbody>
                </table>
            </div>
        )
    }
}

TableOnTab.contextTypes = {
  loginLevel: React.PropTypes.number.isRequired
}