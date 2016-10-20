import React, { Component } from 'react';

export default class HeadSingle extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className="panel-heading HeadSingle">
                <div className="buttonBox">
                    <h3 className="text-primary">{ this.props.itemName }</h3>
                    <button type="button" className="btn btn-primary p-x-1 m-x-1" onClick={this.props.onPrint}>Print</button>
                    <button type="button" className="btn btn-primary p-x-1 m-x-1" onClick={this.props.onSave}>Save</button>
                    <button type="button" className="btn btn-primary p-x-1 m-x-1" onClick={this.props.onEdit}>Edit</button>
                    <button type="button" className="btn btn-primary p-x-1 m-x-1" onClick={this.props.onDelete}>Delete</button>
                </div>
            </div>
        )
    }
}