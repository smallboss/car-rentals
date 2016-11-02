/**
 * Created by watcher on 10/5/16.
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiPayments } from '/imports/api/payments'
import { ApiRentals } from '/imports/api/rentals'
import { ApiCars } from '/imports/api/cars'
import React from 'react'
import { Link } from 'react-router'
import $ from 'jquery'
import { browserHistory } from 'react-router'
import { imgToBase64 } from '../../../../helpers/handlerImages'
import CarRequests from '../CarRequests'
import Rentals from '../Rentals'
import CustomerFines from '../../Customers/CustomersFines'
import CustomerTolls from '../../Customers/CustomersTolls'
import CustomerPayments from '../CustomerPayments'
import './style.css'
const DatePicker = require('react-bootstrap-date-picker')
const _user = {
    id: new Mongo.ObjectID(),
    username: '',
    email: '',
    password: '123456',
    profile: {
        userType: 'customer',
        name: '',
        birthDate: new Date().setFullYear(new Date().getFullYear() - 18),
        phone: '',
        address: '',
        carRequest: [
            {
                _id: new Mongo.ObjectID(),
                dateCreateRequest: '',
                dateFrom: '',
                dateTo: '',
                requestText: ''
            }
        ],
        rentals: [],
        payments: [],
        _images: {
            imgId: '',
            imgLicense: '',
            imgUser: ''
        }
    }
}

class Customer extends React.Component {
    constructor (props, context) {
        super(props)
        this.state = {loginLevel: context.loginLevel, customer: (this.props.params.id == 'new') ? _user : props.customer || _user, editAble: 0}
        this.handlerEditCustomer = this.handlerEditCustomer.bind(this)
        //this.handlerChildState = this.handlerChildState.bind(this)
    }
    componentWillMount () {
        let customer = this.props.customer || _user
        if(this.props.params.id == 'new') {
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
    componentWillReceiveProps (nextProps, nextContext) {
        let customer = nextProps.customer
            loginLevel = nextContext.loginLevel
        this.setState({customer: customer, loginLevel})
        this.forceUpdate()
    }
    componentWillUnMount () {
        this.setState({customer: {}})
    }
    handlerNavUserEdit (e) {
        let li_s = $('.nav-user-edit li').removeClass('active-href-nav'),
            _target = $(this).data('target')
        $(this).addClass('active-href-nav')
        $('.inner-div-users-edit').hide()
        $('#' + _target).show()
    }
    handlerRemoveCustomer (id) {
        if(this.state.loginLevel !== 3) return false
        let _confirm = confirm('Are You sure to delete this customer?')
        if(_confirm) {
            Meteor.call('removeAllUserData', id, (err) => {
                browserHistory.push('/managePanel')
            })                        
        }
    }
    handlerEditCustomer (e) {
        let id = e.target.id,
            _id,
            _newState,
            _href
        switch (id) {
            case 'button_edit':
                this.setState({editAble: 1});
                [...document.getElementsByClassName('form-control')].forEach(input => {
                    if(input.type == 'file') {
                        input.addEventListener('change', (eFile) => {
                            let file = eFile.target.files[0],
                                _target = eFile.target.id,
                                _newFile,
                                _newCustomer = this.state.customer,
                                _images = {}
                            if(!_newCustomer.profile._images){
                                _newCustomer.profile = {}
                                _newCustomer.profile._images = _images
                            }
                            if(file.size > 1100000) {
                                alert('Please upload image less than 1mb')
                                eFile.preventDefault()
                                return false
                            }
                            if(file.type != 'image/png' && file.type != 'image/jpeg') {
                                alert('Please upload image png or jpeg')
                                eFile.preventDefault()
                                return false
                            }
                            imgToBase64(file, (result) => {
                                _newFile = result
                                _newCustomer.profile._images[_target] = _newFile
                                this.setState({customer: _newCustomer})
                            })
                        })
                    } else {
                        input.addEventListener('input', (eInput) => {
                            let customer = this.state.customer,
                                _target = eInput.target.id,
                                _newValue = eInput.target.value
                            if(!customer.profile) {
                                customer.profile = {}
                                customer.emails = [{}]
                            }
                            if(typeof _newValue == 'string') {
                                if (_target == 'username') {
                                    customer[_target] = _newValue
                                } else {
                                    if (_target == 'email') {
                                        if(this.props.params.id == 'new') {
                                            customer[_target] = _newValue
                                            customer.emails = [{address: _newValue}]
                                        } else {
                                            customer.emails[0].address = _newValue
                                        }
                                    } else {
                                        customer.profile[_target] = _newValue
                                    }
                                }
                                this.setState({customer: customer})
                            }
                        })
                    }
                })
                document.getElementById('button_save').addEventListener('click', this.handlerEditCustomer)
                break
            case 'button_save':
                _id = this.state.customer._id || undefined
                _newState = this.state.customer;
                if(_newState._new) {
                    delete _newState._new
                    if(!_newState.profile){
                        _newState.profile = {}
                    }
                    _newState._id = new Mongo.ObjectID()
                    _newState.password = '123456'
                    _newState.profile.userType = 'customer'
                    if(!_newState.username || !_newState.email) {
                        alert('Need Username or Email')
                        break
                    }
                    Meteor.call('createNewUser', _newState, (err, result) => {
                        if(err) {
                            alert(err.reason)
                            location.reload()
                        } else {
                            alert('Default user`s password is 123456')
                            _href = '/managePanel/customer/' + result
                            this.setState({customers: _newState, editAble: 0})
                            browserHistory.push(_href)
                            location.reload()
                        }                        
                    })
                    this.setState({customers: _newState, editAble: 0})
                } else {
                    delete this.state.customer._id
                    Meteor.users.update(_id, {$set: _newState})
                    this.setState({editAble: 0})
                }
                break
            default:
                break
        }
    }
    /*
    handlerChildState(target, data) {
        let _state = this.state.customer,
            _id = this.state.customer._id            
        _state.profile[target] = data
        delete this.state.customer._id
        Meteor.users.update(_id, {$set: _state})
    }
    */
    render () {
        let editAble = (!this.state.editAble) ? 'disabled' : false
        let { _id, username, profile } = this.state.customer
        let email = (this.state.customer.emails) ? this.state.customer.emails[0].address : this.state.customer.email 
        let { name, birthDate, phone, address, carRequest, _images } = profile;
        if(!_images) {
            _images = {
                imgId: '',
                imgLicense: ''
            }
        }
        let { imgId, imgLicense } = _images
        let paymentsIds = profile.payments,
            rentalsIds = profile.rentals,
            payments = [],
            rentals = [],
            fines = [],
            tolls = []            
        paymentsIds.forEach(id => {
            let finder = ApiPayments.findOne({_id: new Mongo.ObjectID(id._str)})
            if (finder) {
                payments.push(finder)
            }
        }) 
        rentalsIds.forEach(id => {
            let finder = ApiRentals.findOne({_id: new Mongo.ObjectID(id._str)})
            if (finder) {
                let car = ApiCars.findOne({_id: new Mongo.ObjectID(finder.car._str)})
                if(car && car.status == 'rented'){
                    fines.push(car.plateNumber)
                    tolls.push(car.plateNumber)
                }
                rentals.push(finder)
            }
        })
        return (
            <div className='panel panel-default'>
                <div className='panel-heading'>
                    <h4><Link to='/managePanel/customers_list'>Customers</Link> / {name}</h4>
                    <input type='button' className='btn btn-primary p-x-1' value='Print' />
                    <input type='button' id='button_save' className='btn btn-primary p-x-1 m-x-1' value='Save' disabled={editAble} />
                    <input type='button' id='button_edit' className='btn btn-primary p-x-1' value='Edit' onClick={this.handlerEditCustomer} />
                    {(this.state.loginLevel === 3) ? <input type='button' className='btn btn-primary p-x-1 m-x-1' value='Delete' onClick={() => { this.handlerRemoveCustomer(_id) }} /> : ''}
                </div>
                <div className='panel-body'>
                    <div className='row'>
                        <div className='col-xs-6'>
                            <label htmlFor='username' className='col-xs-2'>User Name</label>
                            <div className='col-xs-8 form-horizontal'>
                                <input type='text' id='username' className='form-control' value={username} disabled={editAble} />
                            </div>
                        </div>
                        <div className='col-xs-6'>
                            <label htmlFor='address' className='col-xs-2'>Address</label>
                            <div className='col-xs-8 form-horizontal'>
                                <input type='text' id='address' className='form-control' value={address} disabled={editAble} />
                            </div>
                        </div>
                    </div>
                    <div className='row m-y-1'>
                        <div className='col-xs-6'>
                            <label htmlFor='name' className='col-xs-2'>Name</label>
                            <div className='col-xs-8 form-horizontal'>
                                <input type='text' id='name' className='form-control' value={name} disabled={editAble} />
                            </div>
                        </div>
                        <div className='col-xs-6'>
                            <label htmlFor='phone' className='col-xs-2'>Phone</label>
                            <div className='col-xs-8 form-horizontal'>
                                <input type='text' id='phone' className='form-control' maxLength='15' value={phone} disabled={editAble} />
                            </div>
                        </div>
                    </div>
                    <div className='row m-y-1'>
                        <div className='col-xs-6'>
                            <label htmlFor='birhdate' className='col-xs-2'>Birth Date</label>
                            <div className='col-xs-8 form-horizontal'>
                                <DatePicker dateFormat='MM/DD/YYYY' value={birthDate} name='check-picker' onChange={(date) => {
                                let customer = this.state.customer
                                customer.profile['birthDate'] = date.slice(0,10) 
                                this.setState({customer: customer})
                                }} disabled={editAble} />
                            </div>
                        </div>
                        <div className='col-xs-6'>
                            <label htmlFor='email' className='col-xs-2'>Email</label>
                            <div className='col-xs-8 form-horizontal'>
                                <input type='email' id='email' className='form-control' value={email} disabled={editAble} />
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
                                    <input type='file' id='imgId' className='form-control' accept='image/*' disabled={editAble} />
                                </div>
                                <div className='col-xs-6'>
                                    <img src={imgLicense} />
                                    <input type='file' id='imgLicense' className='form-control' accept='image/*' disabled={editAble} />
                                </div>
                            </div>
                            <div id='div_car_request'  className='inner-div-users-edit'>
                                <CarRequests arrToTable={carRequest} customerId={_id} />
                            </div>
                            <div id='div_rentals' className='inner-div-users-edit'>
                                <Rentals rentals={rentals} />
                            </div>
                            <div id='div_payments' className='inner-div-users-edit'>
                                <CustomerPayments payments={payments} customerId={_id} />
                            </div>
                            <div id='div_fines' className='inner-div-users-edit'>
                                <CustomerFines customerArray={fines} />
                            </div>
                            <div id='div_tolls' className='inner-div-users-edit'>
                                <CustomerTolls customerArray={tolls} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Customer.contextTypes = {
    loginLevel: React.PropTypes.number.isRequired
}

export default createContainer(({params}) => {
    Meteor.subscribe('users')
    Meteor.subscribe('payments')
    Meteor.subscribe('rentals')
    Meteor.subscribe('cars')
    let _id = params.id
    if(_id === 'new') {
        return {

        }
    } else {
        return {
            customer: Meteor.users.findOne({_id: _id}),
            payments: ApiPayments.find().fetch(),
            rentals: ApiRentals.find({customerId: _id}).fetch()
        }
    }
}, Customer)


//<Table arrToTable={payments} currentComponent='payments' handlerChildState={this.handlerChildState} />
//<input type='date' id='birthDate' className='form-control' value={birthDate} disabled={editAble}/>