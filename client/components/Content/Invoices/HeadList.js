import React, { Component } from 'react';

export default class HeadList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listName: "Invoices",
            searchField: "",
            disableRemove: true
        }
    }


    onSearchFieldChange(e){
        this.setState({searchField: e.target.value});
    }


    componentWillReceiveProps (props) {
        if(props.numbSelected) this.setState({disableRemove: false});
        else this.setState({disableRemove: true});
    }


    componentDidUpdate() {
        this.buttonRemove.disabled = this.state.disableRemove;
    }


    render(){

        const { currentPage, itemsOnPage, totalItems } = this.props;

        const lastPage = Math.ceil(totalItems / itemsOnPage) ? Math.ceil(totalItems / itemsOnPage) : 1 ;


        const renderLeftArrow = () => {
            let leftArrow;

            if (currentPage === 1 || this.props.numbSelected) {
                leftArrow = 
                    <button className="btn" onClick={this.props.pageDown} disabled>
                        <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                    </button>
            } else {
                leftArrow = 
                    <button className="btn" onClick={this.props.pageDown}>
                        <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                    </button>
            }

            return leftArrow;
        }


        const renderRightArrow = () => {
            let rightArrow;

            if (currentPage === Math.ceil(totalItems / itemsOnPage) || totalItems === 0 || this.props.numbSelected) {
                rightArrow = 
                    <button className="btn" onClick={this.props.pageUp} disabled>
                        <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                    </button>
            } else {
                rightArrow = 
                    <button className="btn" onClick={this.props.pageUp}>
                        <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                    </button>
            }

            return rightArrow;
        }

        return (
            <div className="headList">
                <div className="col-xs-6 left-headList">
                    <h2>{this.state.listName}</h2>

                    <div className="btn-box">
                        <button onClick={this.props.onAddNew} className='btn btn-success m-x-1'>Add New</button>
                        <button 
                            onClick={this.props.onRemoveItems} 
                            ref={(ref) => this.buttonRemove = ref}
                            className='btn btn-danger' >
                            Delete
                        </button>
                    </div>
                </div>

                <div className="col-xs-6 right-headList">
                    <input type="text" className='form-control' placeholder='Search' onChange={ (e) => this.props.onChangeSearchField(e.target.value) } />
                    

                </div>
                <div className='col-xs-12'>
                    <div className="navBox">
                        <span className="pages">
                            <span className="currentPage">{currentPage}</span>
                            of
                            <span className="totalPages">{lastPage}</span>
                        </span>
                        <span className="arrows">
                            {renderLeftArrow()}
                            {renderRightArrow()}
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}