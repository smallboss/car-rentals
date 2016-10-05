import React, { Component } from 'react';

export default class HeadList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listName: "Cars",
            searchField: "",
            disableRemove: true
        }

        // this.onSearchFieldChange = this.onSearchFieldChange.bind(this);
    }


    onSearchFieldChange(e){
        // this.setState({searchField: e.target.value});

        // this.props.onChangeSearchField(e)
    }


    componentWillReceiveProps (props) {
        if(props.numbSelected) this.setState({disableRemove: false});
    }


    render(){

        const { currentPage, itemsOnPage, totalItems } = this.props;

        // let disableRemove = (this.state.disableRemove ? 'disabled' : '');
        let disableRemove = 'disabled'


        return (
            <div className="headList">
                <div className="left-headList">
                    <h2>{this.state.listName}</h2>

                    <div className="btn-box">
                        <button onClick={this.props.onAddNew} className='btn btn-primary'>Add New</button>
                        <button 
                            onClick={this.props.onRemoveCars}
                            className='btn btn-danger'>
                            Delete
                        </button>
                    </div>
                </div>

                <div className="right-headList">
                    <input type="text" onChange={ (e) => this.props.onChangeSearchField(e) } />
                    
                    <div className="navBox">
                        <span className="pages">
                            <span className="currentPage">{currentPage}</span>
                            of
                            <span className="totalPages">{Math.ceil(totalItems / itemsOnPage)}</span>
                        </span>
                        <span className="arrows">
                            <button type="button"><span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button>
                            <button type="button"><span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}