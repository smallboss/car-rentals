import React, { Component, PropTypes } from 'react';

export default class TableHeadButtons extends Component {
    constructor(props) {
        super(props); 

        this.state = {
            activeButton: this.props.selectedItems
        }

        this.disablingButtons = this.disablingButtons.bind(this);
    }   

    componentWillReceiveProps(nextProps) {
        this.setState({activeButton: nextProps.selectedItems})
    }


    componentDidMount(){
        this.disablingButtons();
    }

    componentDidUpdate(){
        this.disablingButtons();
    }

    disablingButtons(){
        this.buttonEdit.disabled = 
        this.buttonRemove.disabled = !this.state.activeButton;
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
                    onClick={this.props.onEdit}>
                    Edit
                  </button>
                  <button
                    onClick={this.props.onRemove}
                    ref={(ref) => this.buttonRemove = ref}
                    style={{margin: '10px'}}
                    className=' m-1 btn btn-danger'>
                    Delete
                  </button>
            </div>
        )
    }
}