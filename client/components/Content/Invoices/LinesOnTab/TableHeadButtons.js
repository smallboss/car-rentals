import React, { Component, PropTypes } from 'react';

export default class TableHeadButtons extends Component {
    constructor(props, context) {
        super(props, context); 

        this.state = {
            loginLevel: props.loginLevel,
            activeButton: this.props.selectedItems
        }

        this.disablingButtons = this.disablingButtons.bind(this);
    }   

    componentWillReceiveProps(nextProps) {
        this.setState({
            loginLevel: nextProps.loginLevel,
            activeButton: nextProps.selectedItems
        })
    }


    componentDidMount(){
        this.disablingButtons();
    }

    componentDidUpdate(){
        this.disablingButtons();
    }

    disablingButtons(){
        this.buttonEdit.disabled = !this.state.activeButton;
        if (this.buttonRemove) this.buttonRemove.disabled = !this.state.activeButton;
    }


    render(){
        const renderBtnRemove = () => {
            if (this.props.loginLevel === 3) {
                return (
                    <button
                        onClick={this.props.onRemove}
                        ref={(ref) => this.buttonRemove = ref}
                        style={{margin: '10px'}}
                        className=' m-1 btn btn-danger'>
                        Delete
                    </button>
                )
            }
            return null;
        }

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
                  { renderBtnRemove() }
            </div>
        )
    }
}
