/**
 * Created by watcher on 10/5/16.
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiCustomers } from '../../../../../imports/api/customers'
import React from 'react'
import $ from 'jquery'
import { browserHistory } from 'react-router'
import { imgToBase64 } from '../../../../helpers/handlerImages'
import Table from '../Table'
import './style.css'

class Customer extends React.Component {
    constructor (props) {
        super(props)
        this.state = {customer: this.props.customer}        
        this.handlerEditCustomer = this.handlerEditCustomer.bind(this)
        this.handlerChildState = this.handlerChildState.bind(this)
    }
    componentWillMount () {
        let customer = this.props.customer || {}
        if(customer.length == 0) {
            customer._id = new Mongo.ObjectID()
            customer.role = 'customer'
            customer._new = 1
        }
        this.setState({customer: customer})
    }
    componentDidMount () {
        [...document.getElementsByClassName('li-nav')].forEach(li => {
            li.addEventListener('click', this.handlerNavUserEdit)
        })
        $('#div_images').show()
        if(this.state.customer._new) {
            $('#button_edit').click()
        }
    }
    componentWillReceiveProps (nextProps) {
        console.log(nextProps)
        let customer = nextProps.customer
        this.setState({customer: customer})
    }
    handlerNavUserEdit (e) {
        let li_s = $('.nav-user-edit li').removeClass('active-href-nav'),
            _target = $(this).data('target')
        $(this).addClass('active-href-nav')
        $('.inner-div-users-edit').hide()
        $('#' + _target).show()
    }
    handlerRemoveCustomer (id) {
        let _confirm = confirm('Are You sure to delete this customer?')
        if(_confirm) {
            ApiCustomers.remove({_id: new Mongo.ObjectID(id._str)})
            browserHistory.push('/customers_list')   
        }        
    }
    handlerEditCustomer (e) {
        let id = e.target.id,
            _id,
            _newState
        switch (id) {
            case 'button_edit':
                $('#button_save').removeAttr('disabled')
                $('.form-control').removeAttr('readOnly')
                $('.form-control').removeAttr('disabled');
                [...document.getElementsByClassName('form-control')].forEach(input => {
                    if(input.type == 'file') {
                        input.addEventListener('change', (eFile) => {
                            let file = eFile.target.files[0],
                                _target = eFile.target.id,
                                _images = this.state.customer._images || {},
                                _newFile,
                                _newCustomer
                            if(file.size > 110000) {
                                alert('Please upload image less than 100kb')
                                eFile.preventDefault()
                                return false
                            }
                            imgToBase64(file, (result) => {
                                _newFile = result
                                _images[_target] = _newFile
                                _newCustomer = {
                                    ...this.state.customer,
                                    _images
                                }
                                this.setState({customer: _newCustomer})
                            })
                        })
                    } else {
                        input.addEventListener('input', (eInput) => {
                            let customer = this.state.customer,
                                _target = eInput.target.id,
                                _newValue = eInput.target.value
                            if(_newValue.length > 0) {
                                customer[_target] = _newValue
                                this.setState({...customer})
                            }
                        })   
                    }                    
                })
                document.getElementById('button_save').addEventListener('click', this.handlerEditCustomer)
                break
            case 'button_save':
                $('.form-control').prop('disabled', true)
                $('#button_save').prop('disabled', true)
                _id = this.state.customer._id
                _newState = this.state.customer;
                if(_newState._new) {
                    delete _newState._new
                    ApiCustomers.insert(_newState)
                    this.setState({customers: _newState})
                } else {
                    delete this.state.customer._id
                    ApiCustomers.update(_id, {$set: _newState})   
                }                
                break
            default:
                break
        }
    }
    handlerChildState(target, data) {
        let _state = this.state.customer,
            _id = this.state.customer._id
        _state[target] = data
        delete this.state.customer._id
        console.log(_state)
        ApiCustomers.update(_id, {$set: _state})        
    }
    render () {
        console.log(this.state.customer)
        let { _id, name, userName, address, email, birthDate, phone, role, _images} = this.state.customer || [],
            carRequest = (this.state.customer.carRequest) ? this.state.customer.carRequest : [
                {
                    _id: new Mongo.ObjectID(),
                    dateCreateRequest: '',
                    dateFrom: '',
                    dateTo: '',
                    requestText: ''
                }
            ],
            rentals = (this.state.customer.rentals) ? this.state.customer.rentals : [
                {
                    _id: new Mongo.ObjectID(),
                    carId: '',
                    dateFrom: '',
                    dateTo: ''
                }
            ],
            payments = (this.state.customer.payments) ? this.state.customer.payments : [
                {
                    _id: new Mongo.ObjectID(),
                    datePayment: '',
                    statePayment: '',
                    QuantityPayment: ''
                }
            ],
            { fines } = this.state.customer || '',
            { tolls } = this.state.customer || '',
            imgId,
            imgLicense
        if (_images) {
            imgId = _images.imgId || ''
            imgLicense = _images.imgLicense || ''             
        }
        console.log('down is state customer')
        console.log(this.state.customer)
        return (
            <div className='panel panel-default'>
                <div className='panel-heading'>
                    <h4>{name} / {userName}</h4>
                    <input type='button' className='btn btn-primary p-x-1' value='Print' />
                    <input type='button' id='button_save' className='btn btn-primary p-x-1 m-x-1' value='Save' disabled />
                    <input type='button' id='button_edit' className='btn btn-primary p-x-1' value='Edit' onClick={this.handlerEditCustomer} />
                    <input type='button' className='btn btn-primary p-x-1 m-x-1' value='Delete' onClick={() => { this.handlerRemoveCustomer(_id) }} />
                </div>
                <div className='panel-body'>
                    <div className='row'>
                        <div className='col-xs-6'>
                            <label htmlFor='name' className='col-xs-2'>Name</label>
                            <div className='col-xs-8 form-horizontal'>
                                <input type='text' id='name' className='form-control' value={name} readOnly/>
                            </div>
                        </div>
                        <div className='col-xs-6'>
                            <label htmlFor='address' className='col-xs-2'>Address</label>
                            <div className='col-xs-8 form-horizontal'>
                                <input type='text' id='address' className='form-control' value={address} readOnly/>
                            </div>
                        </div>
                    </div>
                    <div className='row m-y-1'>
                        <div className='col-xs-6'>
                            <label htmlFor='phone' className='col-xs-2'>Phone</label>
                            <div className='col-xs-8 form-horizontal'>
                                <input type='text' id='phone' className='form-control' value={phone} readOnly/>
                            </div>
                        </div>
                        <div className='col-xs-6'>
                            <label htmlFor='email' className='col-xs-2'>Email</label>
                            <div className='col-xs-8 form-horizontal'>
                                <input type='email' id='email' className='form-control' value={email} readOnly/>
                            </div>
                        </div>
                    </div>
                    <div className='row m-y-1'>
                        <div className='col-xs-6'>
                            <label htmlFor='birhdate' className='col-xs-2'>Birth Date</label>
                            <div className='col-xs-8 form-horizontal'>
                                <input type='date' id='birthDate' className='form-control' value={birthDate} readOnly/>
                            </div>
                        </div>
                    </div>
                    <div className='row m-y-1'>
                        <div className='col-xs-12'>
                            <ul className='nav nav-tabs nav-user-edit'>
                                <li role='presentation' className='li-nav active-href-nav' data-target='div_images'><a>Scans</a></li>
                                <li role='presentation' className='li-nav' data-target='div_car_request'><a>Car Request</a></li>
                                <li role='presentation' className='li-nav' data-target='div_rentals'><a>Rentals</a></li>
                                <li role='presentation' className='li-nav' data-target='div_payments'><a>Payments</a></li>
                                <li role='presentation' className='li-nav' data-target='div_fines'><a>Fines</a></li>
                                <li role='presentation' className='li-nav' data-target='div_tolls'><a>Tolls</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-xs-12'>
                            <div id='div_images' className='inner-div-users-edit'>
                                <div className='col-xs-6'>
                                    <img src={imgId} />
                                    <input type='file' id='imgId' className='form-control' disabled/>
                                </div>
                                <div className='col-xs-6'>
                                    <img src={imgLicense} />
                                    <input type='file' id='imgLicense' className='form-control' disabled/>
                                </div>                          
                            </div>
                            <div id='div_car_request'  className='inner-div-users-edit'>
                                <Table arrToTable={carRequest} currentComponent='carRequest' handlerChildState={this.handlerChildState} />
                            </div>
                            <div id='div_rentals' className='inner-div-users-edit'>
                                <Table arrToTable={rentals} currentComponent='rentals' handlerChildState={this.handlerChildState} />
                            </div>
                            <div id='div_payments' className='inner-div-users-edit'>
                                <Table arrToTable={payments} currentComponent='payments' handlerChildState={this.handlerChildState} />
                            </div>
                            <div id='div_fines' className='inner-div-users-edit'>
                                <div className='form-group'>
                                    <label htmlFor='fines' className='col-xs-2'>Fines</label>
                                    <div className='col-xs-7'>
                                        <input type='text' id='fines' className='form-control' value={fines} disabled />
                                    </div>                                    
                                </div>                                
                            </div>
                            <div id='div_tolls' className='inner-div-users-edit'>
                                <div className='form-group'>
                                    <label htmlFor='tolls' className='col-xs-2'>Tolls</label>
                                    <div className='col-xs-7'>
                                        <input type='text' id='tolls' className='form-control' value={tolls} disabled />
                                    </div>                                    
                                </div>                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default createContainer(({params}) => {
    Meteor.subscribe('customers')
    let _id = params.id
    if(_id === 'new') {
        return {}
    } else {
        return {
            customer: ApiCustomers.findOne({_id: new Mongo.ObjectID(_id)})
        }   
    }    
}, Customer)
