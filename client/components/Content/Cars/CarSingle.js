import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiCars } from '/imports/api/cars.js'
import HeadSingle from './HeadSingle.js';
import { browserHistory } from 'react-router';
import React, { Component } from 'react';
import { clone, cloneDeep, reverse } from 'lodash';

import { carStateTypes } from '/imports/startup/typesList.js';
import TableOnTab from './TableOnTab.js';


import './carStyle.css'


export default class CarSingle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      car: clone(this.props.car),
      dispCar: clone(this.props.car),
      isNew: this.props.isNew,

      selectedMaintenanceID: [],
      editable: this.props.isNew
    };

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
    this.onSaveMaintenance = this.onSaveMaintenance.bind(this);
  }


  onChangeFines(value) {
    let newCar = this.state.dispCar;
    newCar.fines = value;
    this.setState({car: newCar});
  }

  onChangeTolls(value) {
    let newCar = this.state.car;
    newCar.tolls = value;
    this.setState({dispCar: newCar});
  }

  onChangeExpense(value) {
    let newCar = this.state.dispCar;
    newCar.totalExpense = value;
    this.setState({dispCar: newCar});
  }

  onChangeIncome(value) {
    let newCar = this.state.dispCar;
    newCar.totalIncome = value;
    this.setState({dispCar: newCar});
  }

  onChangeName(value) {
    let newCar = this.state.dispCar;
    newCar.name = value;
    this.setState({dispCar: newCar});
  }

  onChangePlateNumber(value) {
    let newCar = this.state.dispCar;
    newCar.plateNumber = value;
    this.setState({dispCar: newCar});
  }

  onChangeProfit(value) {
    let newCar = this.state.dispCar;
    newCar.profit = value;
    this.setState({dispCar: newCar});
  }

  onChangeStatus(value) {
    let newCar = this.state.dispCar;
    newCar.status = value;
    this.setState({dispCar: newCar});
  }

  onChangeDescription(value) {
    let newCar = this.state.dispCar;
    newCar.description = value;
    this.setState({dispCar: newCar});
  }

  onChangeNotes(value) {
    let newCar = this.state.dispCar;
    newCar.notes = value;
    this.setState({dispCar: newCar});
  }


  componentWillReceiveProps(nextProps) {
    let c = nextProps.car;

    if (this.state.car) {
      if (this.state.editable) {
        c.name = clone(this.state.car.name);
      }

      c.maintenance = this.state.car.maintenance;
    }


    if (this.state.editable) {
      c = clone(this.state.car);
    }

    let dataDispCar = clone(this.state.dispCar);

    if (!dataDispCar) {
      dataDispCar = clone(nextProps.car)
    }

    dataDispCar.maintenance = nextProps.car.maintenance;


    this.setState({
      car: clone(c),
      dispCar: dataDispCar
      // editable: this.props.isNew
    });
  }

  handleSave() {
    let newCar = clone(this.state.dispCar);
    newCar.maintenance = this.state.car.maintenance;
    if (!newCar.maintenance) newCar.maintenance = new Array();

    const id = newCar._id;
    delete newCar._id;

    ApiCars.update(id, {$set: newCar});

    newCar_id = id;


    this.setState({car: newCar, dispCar: newCar, editable: false});
  }

  handleEdit() {
    this.setState({editable: !this.state.editable, dispCar: clone(this.state.car)});
  }

  handleDelete() {
    browserHistory.push('/cars');

    ApiCars.remove(this.state.car._id);
  }

  onAddNewMaintenance() {
    let newCarData = clone(this.props.car);


    if (!newCarData.maintenance) newCarData.maintenance = new Array();

    const maintenance = {
      _id: new Mongo.ObjectID()
    };

    newCarData.maintenance.push(maintenance);

    const carId = newCarData._id;
    delete newCarData._id;

    ApiCars.update(carId, newCarData);

    newCarData._id = carId;

    this.setState({car: newCarData});
  }

  onRemoveMaintenance(selectedItems) {
    let car = clone(this.props.car);
    let maintenance = car.maintenance;

    selectedItems.map((delMaintenance) => {
      car.maintenance.map((carMaintenance, key) => {
        if (carMaintenance._id == delMaintenance._id) {
          maintenance.splice(key, 1);
        }
      })
    });

    car.maintenance = maintenance;

    const carId = car._id;
    delete car._id;

    ApiCars.update(carId, car);

    car._id = carId;

    this.setState({car, selectedMaintenanceID: []});
  }


  onSaveMaintenance(maintenance, selectedItemsID) {
    let newCarData = clone(this.props.car);


    newCarData.maintenance.map((carMaintenance, key) => {
      if (carMaintenance._id == maintenance._id) {
        newCarData.maintenance[key] = maintenance;
      }
    })


    const carId = newCarData._id;
    delete newCarData._id;

    ApiCars.update(carId, newCarData);

    newCarData.maintenance.map((carMaintenance, key) => {
      if (carMaintenance._id == maintenance._id) {
        newCarData.maintenance[key] = maintenance;
      }
    })

    newCarData._id = carId;

    this.setState({car: newCarData});
  }

  handleSelect(e, maintenanceID, maintenance) {
    let newSelectedMaintenanceID = this.state.selectedMaintenanceID;
    const index = newSelectedMaintenanceID.indexOf(maintenanceID)

    if (index === -1)
      newSelectedMaintenanceID.push(maintenanceID);
    else
      newSelectedMaintenanceID.splice(index, 1);

    this.setState({selectedMaintenanceID: newSelectedMaintenanceID});
  }


  componentDidMount() {
    if (this.buttonEdit) {
      this.buttonEdit.disabled = false;
    }
  }


  render() {

    const renderHeadSingle = () => {
      return (
        <HeadSingle onSave={this.handleSave}
                    onEdit={this.handleEdit}
                    onDelete={this.handleDelete}
                    itemName={this.state.car.name}/>
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


      const renderTopFields = () => {
        return (
          <div className="topFields">
            <div className="row">
              <div className="form-group name col-xs-6">
                <label htmlFor="carName" className='col-xs-2'>Name</label>
                {(() => {
                  if (this.state.editable) {
                    return (
                      <div className='col-xs-8 form-horizontal'>
                        <input
                          type="text"
                          id="carName"
                          className="form-control "
                          onChange={(e) => this.onChangeName(e.target.value)}
                          value={ this.state.dispCar.name }/>
                      </div>
                    )
                  }

                  return <div className='col-xs-8'>{name}</div>
                })()}
              </div>

              <div className="form-group status col-xs-6">
                <label htmlFor="carStatus" className='col-xs-2'>Status</label>
                {(() => {
                  if (this.state.editable) {
                    return (
                      <div className='col-xs-8 form-horizontal'>
                        <select className=' form-control' onChange={(e) => this.onChangeStatus(e.target.value)}>
                          <option className='' value={this.state.dispCar.status}>{this.state.dispCar.status}</option>
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
                    )
                  }

                  return <div className='col-xs-8'>{status}</div>
                })()}
              </div>
            </div>

            <div className="row">
              <div className="form-group plateNumber col-xs-6">
                <label htmlFor="carPlateNumber" className='col-xs-2'>Plate#</label>
                {(() => {
                  if (this.state.editable) {
                    return (
                      <div className='col-xs-8 form-horizontal'>
                        <input
                          type="text"
                          id="carPlateNumber"
                          className="form-control "
                          onChange={(e) => this.onChangePlateNumber(e.target.value)}
                          value={ this.state.dispCar.plateNumber }/>
                      </div>
                    )
                  }

                  return <div className='col-xs-8'>{plateNumber}</div>
                })()}
              </div>

              <div className="form-group profit col-xs-6">
                <label htmlFor="carprofit" className='col-xs-2'>Profit</label>
                {(() => {
                  if (this.state.editable) {
                    return (
                      <div className=' col-xs-8 form-horizontal'>
                        <input
                          type="text"
                          id="carProfit"
                          className="form-control "
                          onChange={(e) => this.onChangeProfit(e.target.value)}
                          value={ this.state.dispCar.profit }/>
                      </div>
                    )
                  }

                  return <div className='col-xs-8'>{profit}</div>
                })()}
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
              <div role="tabpanel" className="tab-pane p-x-1 active" id="description">
                {(() => {
                  if (this.state.editable) {
                    return (
                      <textarea
                        className='form-control'
                        onChange={(e) => this.onChangeDescription(e.target.value)}
                        value={this.state.dispCar.description}>
                      </textarea>
                    )
                  }

                  return (
                    <textarea 
                      className="form-control" 
                      rows="3"
                      value={description}
                      disabled>
                    </textarea>
                  )
                })()}
              </div>
              <div role="tabpanel" className="tab-pane" id="maintenance">

                { /* ===================== TableOnTab ===================== */}

                <TableOnTab
                  maintenanceList={this.state.car.maintenance}
                  onAddNew={this.onAddNewMaintenance}
                  onSaveMaintenance={this.onSaveMaintenance}
                  onRemove={this.onRemoveMaintenance}/>

              </div>
              <div role="tabpanel" className="tab-pane" id="fines">
                {(() => {
                  if (this.state.editable) {
                    return (
                      <input type="text"
                             className='form-control'
                             onChange={(e) => this.onChangeFines(e.target.value)}
                             value={ this.state.dispCar.fines }/>
                    )
                  }

                  return <div>{fines}</div>
                })()}
              </div>
              <div role="tabpanel" className="tab-pane" id="tolls">
                {(() => {
                  if (this.state.editable) {
                    return (
                      <input type="text"
                             className='form-control'
                             onChange={(e) => this.onChangeTolls(e.target.value)}
                             value={ this.state.dispCar.tolls }/>
                    )
                  }

                  return <div>{tolls}</div>
                })()}
              </div>
              <div role="tabpanel" className="tab-pane" id="notes">
                {(() => {
                  if (this.state.editable) {
                    return (
                      <textarea
                        className='form-control'
                        ref={ (ref) => this.inputNotes = ref }
                        onChange={(e) => this.onChangeNotes(e.target.value)}
                        value={this.state.dispCar.notes}>
                      </textarea>
                    )
                  }

                  return (
                      <textarea
                        className='form-control'
                        ref={ (ref) => this.inputNotes = ref }
                        onChange={(e) => this.onChangeNotes(e.target.value)}
                        value={notes}
                        disabled>
                      </textarea>
                    )
                })()}
              </div>
              <div role="tabpanel" className="tab-pane" id="totalExpense">
                {(() => {
                  if (this.state.editable) {
                    return (
                      <input type="text"
                             className='form-control'
                             onChange={(e) => this.onChangeExpense(e.target.value)}
                             value={ this.state.dispCar.totalExpense }/>
                    )
                  }

                  return <div>{totalExpense}</div>
                })()}
              </div>
              <div role="tabpanel" className="tab-pane" id="totalIncome">
                {(() => {
                  if (this.state.editable) {
                    return (
                      <input type="text"
                             className='form-control'
                             onChange={(e) => this.onChangeIncome(e.target.value)}
                             value={ this.state.dispCar.totalIncome }/>
                    )
                  }

                  return <div>{totalIncome}</div>
                })()}
              </div>
            </div>
          </div>
        )
      }


      return (
        <div className="CarSingle panel panel-default">

          { renderHeadSingle() }
          <div className='panel-body'>
            { renderTopFields() }

            { renderTabs() }
          </div>

        </div>
      )
    } else {
      return (<div className="CarSingle"></div>)
    }
  }
}


export default createContainer(({params}) => {
  Meteor.subscribe('cars');

  let isNew = false;
  let carId = params.carId;

  if (params.carId.indexOf('new') === 0) {
    isNew = true;
    carId = params.carId.substring(3);
    window.history.pushState('object or string', 'Title', `/cars/${carId}`);
    // window.history.back();
  }


  const idForQuery = new Mongo.ObjectID(carId);

  if (!idForQuery) {
    browserHistory.push('/cars');
  }

  return {
    car: ApiCars.findOne(idForQuery),
    isNew: isNew
  }

}, CarSingle)