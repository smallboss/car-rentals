import React, { Component } from 'react';

export default class HeadSingle extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className="panel-heading HeadSingle">
                <div className="buttonBox">
                    <h3 className="text-primary">Single-Invoice</h3>
                    {(() => {
                        let buttonSave = <button type="button" className="btn btn-primary p-x-1 m-x-1" onClick={this.props.onSave} disabled>Save</button>;
                        if (this.props.allowSave) {
                            buttonSave = <button type="button" className="btn btn-primary p-x-1 m-x-1" onClick={this.props.onSave}>Save</button>
                        }
                        
                        return buttonSave;
                    })()}
                    <button type="button" className="btn btn-primary p-x-1 m-x-1" onClick={this.props.onEdit}>Edit</button>
                    <button type="button" className="btn btn-primary p-x-1 m-x-1" onClick={this.props.onDelete}>Delete</button>
                    {(() => {
                        if (this.props.onSendByEmail) {
                            return (
                                <button 
                                    type="button"
                                    onClick={this.props.onSendByEmail}
                                    className='btn btn-primary p-x-1 m-x-1' >
                                    Send by Email
                                </button>
                            )
                        }

                        return undefined;
                    })()}
                </div>
            </div>
        )
    }
}