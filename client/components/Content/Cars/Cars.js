import React, { Component, PropTypes } from 'react';

import { createContainer } from 'meteor/react-meteor-data';

import { ApiCars } from '/imports/api/cars.js';

class Cars extends Component {
  addCar() {
    ApiCars.insert({text: 'blah blah blah'});
  }

  render() {
    console.log(this.props.cars);
    return (
      <div>
        <h1>Cars</h1>
        <button onClick={this.addCar} className='btn btn-primary'>Add something to db</button>
      </div>
    )
  }
}

//���������� ����������� ���� props
Cars.propTypes = {
  cars: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('cars');

  return {
    cars: ApiCars.find().fetch(),
  };
}, Cars);