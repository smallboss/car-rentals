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
      searchField: '',
      currentPage: 1,
      itemsOnPage: 15
    }

    this.handleSelect = this.handleSelect.bind(this);
    this.handleChangeSearchField = this.handleChangeSearchField.bind(this);
    this.removeCars = this.removeCars.bind(this);
    this.addCar = this.addCar.bind(this);
  }

  addCar() {
    ApiCars.insert({_id: new Mongo.ObjectID(), name: 'Subaru', plateNumber: String(Math.random()), status: "avaliable"});
  }

  removeCars() {
    this.state.selectedCarsID.map((carID) => {
      ApiCars.remove(new Mongo.ObjectID(carID));
    })

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


  handleChangeSearchField(e){
    console.log(e.target.value);
    // this.setState({searchField: e.target.value})
  }


  render() {

    const renderCars = () => {
        return this.props.cars.map((itemCar, key) => (
            <CarRow key={key} car={itemCar} selectedCarsId={this.state.selectedCarsID} onHandleSelect={this.handleSelect}/>
        )
      )
    }

    return (
      <div>
        <HeadList
          currentPage={this.state.currentPage}
          itemsOnPage={this.state.itemsOnPage}
          numbSelected={this.state.selectedCarsID.length}
          totalItems={this.props.cars.length}
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