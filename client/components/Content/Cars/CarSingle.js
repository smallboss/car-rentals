import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiCars } from '/imports/api/cars.js'
import HeadSingle from './HeadSingle.js';
import { browserHistory } from 'react-router';
import React, { Component } from 'react';

import { renderTopFieldsNoEditable, renderTabsNoEditable} from './CarSingleHTML.jsx'

import { carStateTypes } from '/imports/startup/typesList.js';


export default class CarSingle extends Component {
    constructor(props) {
        super(props);


        this.state = {
            car: this.props.car,
            editable: (!this.props.car || this.props.car._id === 'new')
        }


        this.onChangeName = this.onChangeName.bind(this);
        this.onChangePlateNumber = this.onChangePlateNumber.bind(this);
        this.onChangeProfit = this.onChangeProfit.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({car: nextProps.car});
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
        console.log(value)
        let newCar = this.state.car;
        newCar.status = value;
        this.setState({car: newCar});
    }


    handleSave(){
        if (this.state.car._id === 'new'){
            let newCar = this.state.car;
            newCar._id = new Mongo.ObjectID();

            ApiCars.insert(newCar);
            browserHistory.push(`/cars/${newCar._id._str}`);
        }
        else {
            ApiCars.remove(this.state.car._id);
            ApiCars.insert(this.state.car);
            // ApiCars.update(this.state.car._id, {$set: { name: this.state.car.name}});
        }
    }


    handleEdit(){
        this.setState({editable: !this.state.editable});
    }


    handleDelete(){
        browserHistory.push('/cars');

        ApiCars.remove(this.state.car._id);
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
                    totalIncome } = this.state.car;


            const renderTopFields = () => {
                if (this.state.editable) {
                    return (
                            <div className="topFields">
                                    <div className="row">
                                        <div className="form-group name">
                                            <label htmlFor="carName">Name</label>
                                            <input 
                                                type="text" 
                                                ref={(ref) => this.inputName = ref} 
                                                id="carName" 
                                                className="form-control"
                                                onChange={(e) => this.onChangeName(e.target.value)}
                                                value={ name } />
                                        </div>

                                        <div className="form-group status">
                                            <label htmlFor="carStatus">Status</label>
                                            <select ref={ (ref) => this.inputStatus = ref } >
                                                <option onChange={(e) => this.onChangeStatus(e.target.value)} value={status}>{status}</option>
                                                {
                                                    carStateTypes.map((el, key) => {
                                                        if (el !== status){
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
                                        <div className="form-group plateNumber">
                                            <label htmlFor="carPlateNumber">Plate#</label>
                                            <input 
                                                type="text" 
                                                ref={ (ref) => this.inputPlateNumber = ref } 
                                                id="carPlateNumber" 
                                                className="form-control" 
                                                onChange={(e) => this.onChangePlateNumber(e.target.value)}
                                                value={ plateNumber } />
                                        </div>

                                        <div className="form-group profit">
                                            <label htmlFor="carprofit">Profit</label>
                                            <input 
                                                type="text" 
                                                ref={ (ref) => this.inputProfit = ref } 
                                                id="carProfit"
                                                className="form-control" 
                                                onChange={(e) => this.onChangeProfit(e.target.value)}
                                                value={ profit } />
                                        </div>
                                    </div>
                            </div>
                    )
                }

                return renderTopFieldsNoEditable(name, status, plateNumber, profit)
            }


            const renderTabs = () => {
                if (this.state.editable) {
                    return (
                        <div className="row">
                          <ul className="nav nav-tabs" role="tablist">
                            <li className="active"><a href="#description" aria-controls="home" role="tab" data-toggle="tab">Description</a></li>
                            <li><a href="#maintenance" aria-controls="messages" role="tab" data-toggle="tab">Maintenance and expense</a></li>
                            <li><a href="#notes" aria-controls="messages" role="tab" data-toggle="tab">Notes</a></li>
                            <li><a href="#totalExpense" aria-controls="settings" role="tab" data-toggle="tab">Total Expense</a></li>
                            <li><a href="#totalIncome" aria-controls="settings" role="tab" data-toggle="tab">Total income</a></li>
                          </ul>
                          <div className="tab-content">
                            <div role="tabpanel" className="tab-pane active" id="description">
                                <textarea disabled>{ description }</textarea>
                            </div>
                            <div role="tabpanel" className="tab-pane" id="maintenance">
                                
                            </div>
                            <div role="tabpanel" className="tab-pane" id="notes">
                                <textarea disabled>{ notes }</textarea>
                            </div>
                            <div role="tabpanel" className="tab-pane" id="totalExpense">
                                <input type="text" value={ totalExpense } />
                            </div>
                            <div role="tabpanel" className="tab-pane" id="totalIncome">
                                <input type="text" value={ totalIncome } />
                            </div>
                          </div>
                        </div>
                    )
                }

                return (renderTabsNoEditable(description, notes, totalExpense, totalIncome));
            }

        
            return(
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

    console.log(params)

    if (params.carId !== 'new'){
        return {
            car: ApiCars.findOne(new Mongo.ObjectID(params.carId))
        }
    }

    return {
        car: {
            _id: 'new',
            name: '',
            status: 'avaliable',
            profit: 0,
            planeNumber: ''

        }
    }

}, CarSingle)