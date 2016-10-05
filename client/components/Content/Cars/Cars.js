import React, { Component, PropTypes } from 'react';

import { createContainer } from 'meteor/react-meteor-data';

import { ApiCars } from '/imports/api/cars.js';

import CarRow from './CarRow.js';
import HeadList from './HeadList.js';

import { map } from 'lodash';


class Cars extends Component {
  constructor(props) {
    super(props); 

    this.state = {
      selectedCarsID: [],
      foundItems: [],
      searchField: '',
      currentPage: 1,
      itemsOnPage: 30
    }

    this.handleSelect = this.handleSelect.bind(this);
    this.handleChangeSearchField = this.handleChangeSearchField.bind(this);
    this.removeCars = this.removeCars.bind(this);
    this.addCar = this.addCar.bind(this);
    this.pageUp = this.changePagePlus.bind(this);
  }

  componentWillReceiveProps(props) {
    // console.log(this.props.cars.length + 'this')
    // console.log(props.cars.length + 'props')
    
    if (this.props.cars.length != props.cars.length) {
      this.handleChangeSearchField();
    }
  }

  componentDidMount(){
    this.setState({foundItems: this.props.cars});
  }


  addCar() {
    ApiCars.insert({_id: new Mongo.ObjectID(), name: 'Subaru', plateNumber: String(Math.random()), status: "avaliable"});
  }

  removeCars() {
    this.state.selectedCarsID.map((carID) => {
      ApiCars.remove(new Mongo.ObjectID(carID));

    })

    // console.log(this.props.cars.length)

    // this.handleChangeSearchField();

    this.setState({selectedCarsID: []});
  }

  handleSelect(e, Car){
    let newSelectedCarsID = this.state.selectedCarsID;
    const CarID = ""+Car._id;
    const index = newSelectedCarsID.indexOf(CarID)

    if (index === -1 ) 
      newSelectedCarsID.push(CarID);
    else 
      newSelectedCarsID.splice(index, 1);
    

    this.setState({selectedCarsID: newSelectedCarsID});
  }


  handleChangeSearchField(queryText = this.state.searchField){
    console.log(queryText);
    const searchQuery = queryText.toLowerCase();

    var displayedCars = this.props.cars.filter(function(el) {
        const searchValue = el.name.toLowerCase();
        return searchValue.indexOf(searchQuery) !== -1;
    });

    // console.log(displayedCars)

    this.setState({
      searchField: queryText,
      foundItems: displayedCars
    })
  }


  changePagePlus(){
    console.log('to')
    this.setState({currentPage: this.state.currentPage + 1 });
  }


  render() {

    const renderCars = () => {

        // this.state.foundItems.map((itemCar, key) => console.log(itemCar, key) )
        return this.state.foundItems.map((itemCar, key) => {
          if(   (key >= (this.state.currentPage-1) * this.state.itemsOnPage) 
             && (key <   this.state.currentPage    * this.state.itemsOnPage))
            return <CarRow key={key} car={itemCar} selectedCarsId={this.state.selectedCarsID} onHandleSelect={this.handleSelect}/>
        }
      )
    }

    return (
      <div>
        <HeadList
          currentPage={this.state.currentPage}
          itemsOnPage={this.state.itemsOnPage}
          numbSelected={this.state.selectedCarsID.length}
          totalItems={this.props.cars.length}
          onChangeP={this.changePagePlus}
          onChangeSearchField={this.handleChangeSearchField}
          onAddNew={this.addCar} 
          onRemoveCars={this.removeCars} />

        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th><input type="checkbox" disabled="true"/></th>
              <th>Name</th>
              <th>Plate number</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
           {renderCars()}
          </tbody>
        </table>
      </div>
    )
  }
}

//Îáúÿâëÿéòå îáÿçàòåëüíî òèïû props
Cars.propTypes = {
  cars: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('cars');

  return {
    cars: ApiCars.find().fetch(),
  };
}, Cars);