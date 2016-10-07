import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiCars } from '/imports/api/cars.js'
import HeadSingle from './HeadSingle.js';
import { browserHistory } from 'react-router';
import React, { Component } from 'react';

import { carStateTypes } from '/imports/startup/typesList.js';

import MaintenanceRow from './MaintenanceRow.js';

import { clone } from 'lodash';

import './carStyle.css'


export default class CarSingle extends Component {
  constructor(props) {
    super(props);


    const isNew = (this.props.car && this.props.car._id === 'new') ? true : false;


    this.state = {
      car: this.props.car,
      maintenance: [],
      selectedMaintenanceID: [],
      editable: isNew
    }


    this.onChangeName = this.onChangeName.bind(this);
    this.onChangePlateNumber = this.onChangePlateNumber.bind(this);
    this.onChangeProfit = this.onChangeProfit.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.onChangeFines = this.onChangeFines.bind(this);
    this.onChangeTolls = this.onChangeTolls.bind(this);
    this.onChangeExpense = this.onChangeExpense.bind(this)
    this.onChangeIncome = this.onChangeIncome.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeNotes = this.onChangeNotes.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.onAddNewMaintenance = this.onAddNewMaintenance.bind(this);
    this.onRemoveMaintenance = this.onRemoveMaintenance.bind(this);
    this.trueDisabledButtomRemove = this.trueDisabledButtomRemove.bind(this);
  }


  onChangeFines(value) {
    let newCar = this.state.car;
    newCar.fines = value;
    this.setState({car: newCar});
  }

  onChangeTolls(value) {
    let newCar = this.state.car;
    newCar.tolls = value;
    this.setState({car: newCar});
  }

  onChangeExpense(value) {
    let newCar = this.state.car;
    newCar.totalExpense = value;
    this.setState({car: newCar});
  }

  onChangeIncome(value) {
    let newCar = this.state.car;
    newCar.totalIncome = value;
    this.setState({car: newCar});
  }


  componentWillReceiveProps(nextProps) {
    let c = nextProps.car;
    if (this.state.car) {
      c.maintenance = this.state.car.maintenance;
    }


    const isNew = (this.props.car && this.props.car._id === 'new') ? true : false;


    this.setState({
      car: c,
      editable: isNew
    });
  }

  onChangeName(value) {
    let newCar = this.state.car;
    newCar.name = value;
    this.setState({car: newCar});
  }

  onChangePlateNumber(value) {
    let newCar = this.state.car;
    newCar.plateNumber = value;
    this.setState({car: newCar});
  }

  onChangeProfit(value) {
    let newCar = this.state.car;
    newCar.profit = value;
    this.setState({car: newCar});
  }

  onChangeStatus(value) {
    let newCar = this.state.car;
    newCar.status = value;
    this.setState({car: newCar});
  }

  onChangeDescription(value) {
    let newCar = this.state.car;
    newCar.description = value;
    this.setState({car: newCar});
  }

  onChangeNotes(value) {
    let newCar = this.state.car;
    newCar.notes = value;
    this.setState({car: newCar});
  }


  handleSave() {
    let newCar = this.state.car;

    if (!newCar.maintenance) newCar.maintenance = new Array();

    if (this.state.car._id === 'new') {
      newCar._id = new Mongo.ObjectID();

      ApiCars.insert(newCar);
      browserHistory.push(`/cars/${newCar._id._str}`);
    }
    else {
      const id = newCar._id;
      delete newCar._id;
      console.log("UPDATE");
      ApiCars.update(id, {$set: newCar});
    }
  }

  handleEdit() {
    this.setState({editable: !this.state.editable});
  }

  handleDelete() {
    browserHistory.push('/cars');

    ApiCars.remove(this.state.car._id);
  }

  onAddNewMaintenance() {
    let newCarData = this.state.car;

    if (!newCarData.maintenance) newCarData.maintenance = new Array();

    const maintenance = {
      _id: new Mongo.ObjectID()
    };

    newCarData.maintenance.push(maintenance);

    this.setState({car: newCarData});
  }

  onRemoveMaintenance() {

    // let car = this.state.car;

    let car = clone(this.state.car);
    let maintenance = car.maintenance;
    this.state.selectedMaintenanceID.map((maintenanceID) => {
      car.maintenance.map((carMaintenance, key) => {
        if (carMaintenance._id == maintenanceID) {
          console.log(maintenance.splice(key, 1))
        }
      })
    });

    console.log(maintenance);

    car.maintenance = maintenance;

    console.log("this.state.car", this.state.car);
    console.log("newCarData", car);

    const carId = this.state.car._id;

    // let newCar = this.state.car;

    // if(!newCar.maintenance) newCar.maintenance = new Array();

    // if (this.state.car._id === 'new'){
    //     newCar._id = new Mongo.ObjectID();

    //     ApiCars.insert(newCar);
    //     browserHistory.push(`/cars/${newCar._id._str}`);
    // }
    // else {
    // car.splice(car.indexOf('_id'), 1);
    delete car._id;
    console.log("carId", car);
    ApiCars.update(carId, car);


    // // }

    car._id = carId;

    // console.log('NEW MASS:', newMaintenances)

    // newCarData.maintenance = newMaintenances;

    this.setState({car, selectedMaintenanceID: []});
  }


  handleSelect(e, maintenanceID) {
    let newSelectedMaintenanceID = this.state.selectedMaintenanceID;

    const index = newSelectedMaintenanceID.indexOf(maintenanceID)

    if (index === -1)
      newSelectedMaintenanceID.push(maintenanceID);
    else
      newSelectedMaintenanceID.splice(index, 1);

    console.log('newSelectedMaintenanceID', newSelectedMaintenanceID)


    this.setState({selectedMaintenanceID: newSelectedMaintenanceID});
  }


  trueDisabledButtomRemove() {
    this.buttonRemove.disabled = !this.state.selectedMaintenanceID.length
      ? true
      : !this.state.editable;
  }


  componentDidMount() {
    const isNew = (this.props.car && this.props.car._id === 'new') ? true : false;

    this.setState({editable: isNew})
  }


  componentDidUpdate() {
    // mainteance buttons
    this.buttonAdd.disabled = !this.state.editable;
    this.trueDisabledButtomRemove();

    this.inputName.disabled =
      this.inputPlateNumber.disabled =
        this.inputStatus.disabled =
          this.inputProfit.disabled =
            this.inputFines.disabled =
              this.inputTolls.disabled =
                this.inputExpense.disabled =
                  this.inputIncome.disabled =
                    this.inputDescription.disabled =
                      this.inputNotes.disabled = !this.state.editable;
  }


  render() {

    const renderHeadSingle = () => {
      return (
        <HeadSingle onSave={this.handleSave}
                    onEdit={this.handleEdit}
                    onDelete={this.handleDelete}/>
      )
    }

    if (this.state.car) {

      let {
        name,
        status,
        plateNumber,
        profit,
        notes,
        description,
        totalExpense,
        totalIncome,
        fines,
        tolls,
        maintenance } = this.state.car;

      if (!maintenance) maintenance = new Array();

      console.log(maintenance);

      const renderMaintenance = () => {
        console.log(this.state.car.maintenance);
        return this.state.car.maintenance.map((item, key) => {
          return (
            <MaintenanceRow
              editable={this.state.editable}
              maintenance={item}
              onHandleSelect={this.handleSelect}
              selectedMaintenanceID={this.state.selectedMaintenanceID}/>
          )
        })
      }


      const renderTopFields = () => {
        return (
          <div className="topFields">
            <div className="row">
              <div className="form-group name col-xs-6">
                <label htmlFor="carName">Name</label>
                <input
                  type="text"
                  ref={(ref) => this.inputName = ref}
                  id="carName"
                  className="form-control"
                  onChange={(e) => this.onChangeName(e.target.value)}
                  value={ name }/>
              </div>

              <div className="form-group status col-xs-6">
                <label htmlFor="carStatus">Status</label>
                <select ref={ (ref) => this.inputStatus = ref } onChange={(e) => this.onChangeStatus(e.target.value)}>
                  <option value={status}>{status}</option>
                  {
                    carStateTypes.map((el, key) => {
                        if (el !== status) {
                          return (
                            <option key={key} value={el}>{el}</option>
                          )
                        }
                        return undefined;
                      }
                    )}
                </select>
              </div>
            </div>

            <div className="row">
              <div className="form-group plateNumber col-xs-6">
                <label htmlFor="carPlateNumber">Plate#</label>
                <input
                  type="text"
                  ref={ (ref) => this.inputPlateNumber = ref }
                  id="carPlateNumber"
                  className="form-control"
                  onChange={(e) => this.onChangePlateNumber(e.target.value)}
                  value={ plateNumber }/>
              </div>

              <div className="form-group profit col-xs-6">
                <label htmlFor="carprofit">Profit</label>
                <input
                  type="text"
                  ref={ (ref) => this.inputProfit = ref }
                  id="carProfit"
                  className="form-control"
                  onChange={(e) => this.onChangeProfit(e.target.value)}
                  value={ profit }/>
              </div>
            </div>
          </div>
        )
      }


      const renderTabs = () => {
        return (
          <div className="row">
            <ul className="nav nav-tabs" role="tablist">
              <li className="active"><a href="#description" aria-controls="home" role="tab" data-toggle="tab">Description</a>
              </li>
              <li><a href="#maintenance" aria-controls="messages" role="tab" data-toggle="tab">Maintenance and
                expense</a></li>
              <li><a href="#fines" aria-controls="messages" role="tab" data-toggle="tab">Fines</a></li>
              <li><a href="#tolls" aria-controls="messages" role="tab" data-toggle="tab">Tolls</a></li>
              <li><a href="#notes" aria-controls="messages" role="tab" data-toggle="tab">Notes</a></li>
              <li><a href="#totalExpense" aria-controls="settings" role="tab" data-toggle="tab">Total Expense</a></li>
              <li><a href="#totalIncome" aria-controls="settings" role="tab" data-toggle="tab">Total income</a></li>
            </ul>
            <div className="tab-content">
              <div role="tabpanel" className="tab-pane active" id="description">
                                <textarea
                                  ref={ (ref) => this.inputDescription = ref }
                                  onChange={(e) => this.onChangeDescription(e.target.value)}
                                  value={description}>
                                </textarea>
              </div>
              <div role="tabpanel" className="tab-pane" id="maintenance">
                <div>
                  <button
                    onClick={this.onAddNewMaintenance}
                    ref={(ref) => this.buttonAdd = ref}
                    className='btn btn-primary'>
                    Add New
                  </button>
                  <button
                    onClick={this.onRemoveMaintenance}
                    ref={(ref) => this.buttonRemove = ref}
                    className='btn btn-danger'>
                    Delete
                  </button>
                </div>
                <table className="table table-bordered table-hover">
                  <thead>
                  <tr>
                    <th><input type="checkbox" disabled/></th>
                    <th>Job ID</th>
                    <th>Job Name</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>End Date</th>
                  </tr>
                  </thead>

                  <tbody>
                  {

                    renderMaintenance()
                  }
                  </tbody>
                </table>
              </div>
              <div role="tabpanel" className="tab-pane" id="fines">
                <input type="text"
                       onChange={(e) => this.onChangeFines(e.target.value)}
                       value={ fines }
                       ref={ (ref) => this.inputFines = ref }/>
              </div>
              <div role="tabpanel" className="tab-pane" id="tolls">
                <input type="text"
                       onChange={(e) => this.onChangeTolls(e.target.value)}
                       value={ tolls }
                       ref={ (ref) => this.inputTolls = ref }/>
              </div>
              <div role="tabpanel" className="tab-pane" id="notes">
                                <textarea
                                  ref={ (ref) => this.inputNotes = ref }
                                  onChange={(e) => this.onChangeNotes(e.target.value)}
                                  value={notes}>
                                </textarea>
              </div>
              <div role="tabpanel" className="tab-pane" id="totalExpense">
                <input type="text"
                       onChange={(e) => this.onChangeExpense(e.target.value)}
                       value={ totalExpense }
                       ref={ (ref) => this.inputExpense = ref }/>
              </div>
              <div role="tabpanel" className="tab-pane" id="totalIncome">
                <input type="text"
                       onChange={(e) => this.onChangeIncome(e.target.value)}
                       value={ totalIncome }
                       ref={ (ref) => this.inputIncome = ref }/>
              </div>
            </div>
          </div>
        )
      }


      return (
        <div className="CarSingle container">

          { renderHeadSingle() }

          { renderTopFields() }

          { renderTabs() }

        </div>
      )
    } else {
      return (<div className="CarSingle"></div>)
    }
  }
}


export default createContainer(({params}) => {
  Meteor.subscribe('cars');

  if (params.carId !== 'new') {
    console.log(params);
    return {
      car: ApiCars.findOne(new Mongo.ObjectID(params.carId))
    }
  }

  return {
    car: {
      _id: 'new',
      name: '',
      status: '',
      profit: 0,
      planeNumber: ''

    }
  }

}, CarSingle)