import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router'

import { createContainer } from 'meteor/react-meteor-data';

import { ApiCars } from '/imports/api/cars.js';

import CarRow from './CarRow.js';
import HeadList from './HeadList.js';

import { map, debounce } from 'lodash';


class Cars extends Component {
  constructor(props, context) {
    super(props, context); 

    this.state = {
      loginLevel: context.loginLevel,
      selectedCarsID: [],
      foundItems: [],
      searchField: '',
      currentPage: 1,
      itemsOnPage: 10,
      electedAll: false
    }

    this.handleSelect = this.handleSelect.bind(this);
    this.handleSelectAll = this.handleSelectAll.bind(this);
    this.handleChangeSearchField = debounce(this.handleChangeSearchField.bind(this), 350);
    this.removeCars = this.removeCars.bind(this);
    this.addCar = this.addCar.bind(this);
    this.pageUp = this.pageUp.bind(this);
    this.pageDown = this.pageDown.bind(this);
    this.handleCarSingleOnClick = this.handleCarSingleOnClick.bind(this);

    context.router
  }
  

  componentWillReceiveProps(props, nextContext) {    
    if (this.props.cars != props.cars) {
      this.handleChangeSearchField(this.state.searchField, props);
    }

    this.setState({loginLevel: nextContext.loginLevel});
  }

  componentWillUpdate(nextProps, nextState){
    const lastPage = Math.ceil(nextState.foundItems.length / this.state.itemsOnPage);

    if(nextState.foundItems.length && this.state.currentPage > lastPage)
      this.setState({currentPage: lastPage});
  }


  componentDidMount(){
    this.setState({foundItems: this.props.cars});
  }


  addCar() {
    const _id = new Mongo.ObjectID();
    ApiCars.insert({ _id, maintenance: [] });
    browserHistory.push(`/managePanel/cars/new${_id}`);
  }


  removeCars() {
    this.state.selectedCarsID.map((carID) => {
      ApiCars.remove(new Mongo.ObjectID(carID));

    })

    this.setState({selectedCarsID: []});
  }


  handleSelectAll(){
    const { selectedCarsID, itemsOnPage, foundItems, selectedAll } = this.state;
    let newSelectedCarsID = [];

    if (!selectedAll) {
      foundItems.map((itemCar, key) => {
          if((key >= (this.state.currentPage-1) * this.state.itemsOnPage) && 
             (key <   this.state.currentPage    * this.state.itemsOnPage)){

            if (!newSelectedCarsID.includes(itemCar._id._str)) {
              newSelectedCarsID.push(itemCar._id._str);
            }
          }
      });
    }

    this.selectAll.checked = !selectedAll;
    
    this.setState({selectedCarsID: newSelectedCarsID, selectedAll: !selectedAll});
  }


  handleSelect(e, Car){
    let newSelectedCarsID = this.state.selectedCarsID;
    const CarID = ""+Car._id;
    const index = newSelectedCarsID.indexOf(CarID);
    let currentSelectedAll = this.state.selectedAll;

    if (index === -1 ) 
      newSelectedCarsID.push(CarID);
    else 
      newSelectedCarsID.splice(index, 1);

    if (currentSelectedAll || !newSelectedCarsID.length) {
      currentSelectedAll = false;
      this.selectAll.checked = currentSelectedAll;
    }
    

    this.setState({selectedCarsID: newSelectedCarsID, electedAll: currentSelectedAll});
  }


  handleChangeSearchField(queryText = this.state.searchField, props = this.props){
    const searchQuery = queryText.toLowerCase();

    var displayedCars = props.cars.filter(function(el) {
        const carName        = el.name ? el.name.toLowerCase() : '';
        const carPlateNumber = el.plateNumber ? el.plateNumber.toLowerCase() : '';
        const carStatus      = el.status ? el.status.toLowerCase() : '';

        return (carName.indexOf(searchQuery) !== -1 || 
                carPlateNumber.indexOf(searchQuery) !== -1 || 
                carStatus.indexOf(searchQuery) !== -1)
    });


    this.setState({
      searchField: queryText,
      foundItems: displayedCars
    })
  }


  pageUp(){
    this.setState({currentPage: this.state.currentPage + 1 });
  }

  pageDown(){
    this.setState({currentPage: this.state.currentPage - 1 });
  }


  handleCarSingleOnClick(carId) {
    browserHistory.push(`/managePanel/cars/${carId}`)
    // this.context.router.push(`/cars/${carId}`)
  }


  render() {

    const renderCars = () => {
      return this.state.foundItems.map((itemCar, key) => {
        if(   (key >= (this.state.currentPage-1) * this.state.itemsOnPage) 
           && (key <   this.state.currentPage    * this.state.itemsOnPage))

          return <CarRow 
                    key={key} 
                    car={itemCar} 
                    onClick={this.handleCarSingleOnClick.bind(null, itemCar._id)}
                    selectedCarsId={this.state.selectedCarsID} 
                    onHandleSelect={this.handleSelect}
                    loginLevel={this.state.loginLevel} />
        }
      )
    }


    const renderHeadCheckBox = () => {
      if (this.state.loginLevel === 3) 
        return (
          <th>
            <input type="checkbox" 
                   ref={(ref) => this.selectAll = ref}
                   onChange={this.handleSelectAll} />
          </th>
        )

      return null;
    }

    return (
      <div>
        <HeadList
          currentPage={this.state.currentPage}
          itemsOnPage={this.state.itemsOnPage}
          numbSelected={this.state.selectedCarsID.length}
          totalItems={this.state.foundItems.length}
          pageUp={this.pageUp}
          pageDown={this.pageDown}
          onChangeSearchField={this.handleChangeSearchField}
          onAddNew={this.addCar} 
          onRemoveCars={this.removeCars}
          loginLevel={this.state.loginLevel} />

        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              { renderHeadCheckBox() }
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

Cars.propTypes = {
  cars: PropTypes.array.isRequired,
};

Cars.contextTypes = {
  router: React.PropTypes.object.isRequired,
  loginLevel: React.PropTypes.number.isRequired
}


export default createContainer(() => {
  Meteor.subscribe('cars');

  return {
    cars: ApiCars.find().fetch(),
  };
}, Cars);