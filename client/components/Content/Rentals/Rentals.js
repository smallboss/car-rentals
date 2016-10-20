import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router'

import { createContainer } from 'meteor/react-meteor-data';

import { ApiCars } from '/imports/api/cars.js';
import { ApiRentals } from '/imports/api/rentals.js';

import RentalRow from './RentalRow.js';
import HeadList from './HeadList.js';

import { map, debounce } from 'lodash';


class Rentals extends Component {
  constructor(props, context) {
    super(props, context); 

    this.state = {
      selectedItemsID: [],
      foundItems: [],
      searchField: '',
      currentPage: 1,
      itemsOnPage: 10
    }

    this.handleSelect = this.handleSelect.bind(this);
    this.handleChangeSearchField = debounce(this.handleChangeSearchField.bind(this), 350);
    this.removeItems = this.removeItems.bind(this);
    this.pageUp = this.pageUp.bind(this);
    this.pageDown = this.pageDown.bind(this);

    context.router
  }
  

  componentWillReceiveProps(props) {    
    if (this.props.rentals != props.rentals) {
      this.handleChangeSearchField(this.state.searchField, props);
    }
  }

  componentWillUpdate(nextProps, nextState){
    let nState = nextState ? nextState : {};
    nState.foundItems = nState.foundItems ? nState.foundItems : [];
    const lastPage = Math.ceil(nState.foundItems.length / this.state.itemsOnPage);

    if(nextState.foundItems.length && this.state.currentPage > lastPage)
      this.setState({currentPage: lastPage});
  }


  componentDidMount(){
    this.setState({foundItems: this.props.cars});
  }

  removeItems() {
    this.state.selectedItemsID.map((carID) => {
      ApiItems.remove(new Mongo.ObjectID(carID));

    })

    this.setState({selectedItemsID: []});
  }

  handleSelect(e, Item){
    let newSelectedItemsID = this.state.selectedItemsID;
    const ItemID = ""+Item._id;
    const index = newSelectedItemsID.indexOf(ItemID)

    if (index === -1 ) 
      newSelectedItemsID.push(ItemID);
    else 
      newSelectedItemsID.splice(index, 1);
    

    this.setState({selectedItemsID: newSelectedItemsID});
  }


  handleChangeSearchField(queryText = this.state.searchField, props = this.props){
    const searchQuery = queryText.toLowerCase();

    var displayedItems = props.rentals.filter(function(el) {
        const carName        = el.name ? el.name.toLowerCase() : '';


        return (carName.indexOf(searchQuery) !== -1)
    });


    this.setState({
      searchField: queryText,
      foundItems: displayedItems
    })
  }


  pageUp(){
    this.setState({currentPage: this.state.currentPage + 1 });
  }

  pageDown(){
    this.setState({currentPage: this.state.currentPage - 1 });
  }


  render() {

    const renderRentals = () => {
      return this.state.foundItems.map((item, key) => {
        if(   (key >= (this.state.currentPage-1) * this.state.itemsOnPage) 
           && (key <   this.state.currentPage    * this.state.itemsOnPage))

           console.log('item', item);

          return <RentalRow 
                    key={`rental-${key}`} 
                    rental={item}
                    selectedItemsId={this.state.selectedItemsID} 
                    onHandleSelect={this.handleSelect} />
        }
      )
    }

    return (
      <div>
        <HeadList
          currentPage={this.state.currentPage}
          itemsOnPage={this.state.itemsOnPage}
          numbSelected={this.state.selectedItemsID.length}
          totalItems={this.state.foundItems.length}
          pageUp={this.pageUp}
          pageDown={this.pageDown}
          onChangeSearchField={this.handleChangeSearchField}
          onAddNew={this.addItem} 
          onRemoveItems={this.removeItems}
          isReport={true} />

        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th><input type="checkbox" disabled="true"/></th>
              <th>Customer</th>
              <th>Car</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>

          <tbody>
           {renderRentals()}
          </tbody>
        </table>
      </div>
    )
  }
}

Rentals.propTypes = {
  rentals: PropTypes.array.isRequired,
};

Rentals.contextTypes = {
  router: React.PropTypes.object.isRequired
}


export default createContainer(() => {
  Meteor.subscribe('rentals');

  return {
    rentals: ApiRentals.find().fetch(),
  };
}, Rentals);