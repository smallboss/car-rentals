import React, { Component } from 'react';

export default class HeadSingle extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className="HeadSingle">
                <div className="buttonBox">
                    <button type="button" className="btn btn-success" onClick={this.props.onSave}>Save</button>
                    <button type="button" className="btn btn-warning" onClick={this.props.onEdit}>Edit</button>
                    <button type="button" className="btn btn-danger" onClick={this.props.onDelete}>Delete</button>
                </div>
            </div>
        )
    }
}