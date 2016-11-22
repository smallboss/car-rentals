import React, { Component } from 'react';

export default class HeadSingle extends Component {
    constructor(props) {
        super(props);
    }

    render(){

        const renderBtnRemove = () => {
            if (this.props.loginLevel === 3) {
                return (
                    <button type="button" 
                            className="btn btn-primary p-x-1 m-x-1" 
                            onClick={this.props.onDelete}>Delete
                    </button>
                )
            }

            return null;
        }
        
        return (
            <div className="panel-heading HeadSingle">
                <div className="buttonBox">
                    <h3 className="text-primary">{ this.props.itemName }</h3>
                    <button type="button" className="btn btn-primary p-x-1 m-x-1" onClick={this.props.onPrint}>Print</button>
                    <button type="button" className="btn btn-primary p-x-1 m-x-1" onClick={this.props.onSave}>Save</button>
                    <button type="button" className="btn btn-primary p-x-1 m-x-1" onClick={this.props.onEdit}>Edit</button>
                    { renderBtnRemove() }
                </div>
            </div>
        )
    }
}