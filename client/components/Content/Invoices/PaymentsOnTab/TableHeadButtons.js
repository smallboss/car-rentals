import React, { Component, PropTypes } from 'react';

export default class TableHeadButtons extends Component {
    constructor(props) {
        super(props); 

        this.state = {
        }
    }   

    render(){
        return(
            <div className="TableHeadButtons">
                <button
                    onClick={this.props.onAddNew}
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
                  <button
                    onClick={this.onRemoveMaintenance}
                    ref={(ref) => this.buttonRemove = ref}
                    style={{margin: '10px'}}
                    className=' m-1 btn btn-danger'>
                    Delete
                  </button>
            </div>
        )
    }
}