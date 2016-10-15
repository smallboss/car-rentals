/**
 * Created by watcher on 10/5/16.
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiPayments } from '/imports/api/payments'
import React from 'react'
import $ from 'jquery'
import { browserHistory } from 'react-router'
import { imgToBase64 } from '../../../../helpers/handlerImages'
import Table from '../Table'
import './style.css'

class Customer extends React.Component {
    constructor (props) {
        super(props)
        this.state = {customer: props.customer, editAble: 0}
        this.handlerEditCustomer = this.handlerEditCustomer.bind(this)
        this.handlerChildState = this.handlerChildState.bind(this)
    }
    componentWillMount () {
        let customer = this.props.customer || {}
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
    componentWillReceiveProps (nextProps) {
        let customer = nextProps.customer
        this.setState({customer: customer})
        this.forceUpdate()
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
            Meteor.call('removeAllUserData', id, (err) => {
                browserHistory.push('/customers_list')
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
                    Meteor.call('createNewUser', _newState, (err, result) => {
                        if(err) {
                            alert(err.reason)
                        } else {
                            alert('Default user`s password is 123456')
                            _href = '/customer/' + result
                            browserHistory.push(_href)   
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
    handlerChildState(target, data) {
        let _state,
            _id = this.state.customer._id, 
            _idPayment
            //currentPayments = this.state.customer.profile.payments
        if(target == 'payments') {
            data.forEach(item => {
                _idPayment = new Mongo.ObjectID(item._id._str)
                if(ApiPayments.findOne({_id: _idPayment})) {
                    delete item._id
                    ApiPayments.update({_id: _idPayment}, {$set: item})    
                } else {
                    Meteor.users.update({_id: _id}, {$push: {'profile.payments': _idPayment}})
                    ApiPayments.insert(item)
                }
            })
            return
        }
        _state = this.state.customer
        _state.profile[target] = data
        delete this.state.customer._id
        Meteor.users.update(_id, {$set: _state})
    }
    render () {
        let editAble = (!this.state.editAble) ? 'disabled' : false
        let { _id, username } = this.state.customer || [];
        let email = ''
        if(this.state.customer.emails) {
            email = this.state.customer.emails[0].address   
        }
        let { name, birthDate, phone, address, userType } = this.state.customer.profile || '';
        let { fines } = this.state.customer.profile || '',
            { tolls } = this.state.customer.profile || '',
            carRequest,
            rentals,
            payments = []
        if(this.state.customer.profile && (typeof this.state.customer.profile._images == 'object')){
            _images = this.state.customer.profile._images
        } else {
            _images = {
                imgId: '',
                imgLicense: ''
            }
        }
        let { imgId, imgLicense } = _images
        if(this.state.customer.profile && (typeof this.state.customer.profile.carRequest == 'object')) {
            carRequest = this.state.customer.profile.carRequest
        } else {
            carRequest = [
                {
                    _id: new Mongo.ObjectID(),
                    dateCreateRequest: '',
                    dateFrom: '',
                    dateTo: '',
                    requestText: ''
                }
            ]
        }
        if(this.state.customer.profile && (typeof this.state.customer.profile.rentals == 'object')) {
            rentals = this.state.customer.profile.rentals
        } else {
            rentals = [
                {
                    _id: new Mongo.ObjectID(),
                    carId: '',
                    dateFrom: '',
                    dateTo: ''
                }
            ]
        }
        if(this.state.customer.profile && (typeof this.state.customer.profile.payments == 'object')) {
            let paymentsIds = this.state.customer.profile.payments
            let paymentsProps = this.props.payments
            paymentsIds.forEach(id => {
                let finder = ApiPayments.findOne({_id: new Mongo.ObjectID(id._str)})
                if (finder) {
                    payments.push(finder)
                }
            })
        } 
        if(payments.length == 0) {
            payments = [ {
                _id: new Mongo.ObjectID(),
                amount: '',
                customerId: _id,
                date: '',
                ref: '',
                status: ''
            }]
        }
        return (
            <div className='panel panel-default'>
                <div className='panel-heading'>
                    <h4>{username} / {name}</h4>
                    <input type='button' className='btn btn-primary p-x-1' value='Print' />
                    <input type='button' id='button_save' className='btn btn-primary p-x-1 m-x-1' value='Save' disabled={editAble} />
                    <input type='button' id='button_edit' className='btn btn-primary p-x-1' value='Edit' onClick={this.handlerEditCustomer} />
                    <input type='button' className='btn btn-primary p-x-1 m-x-1' value='Delete' onClick={() => { this.handlerRemoveCustomer(_id) }} />
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
                                <input type='text' id='phone' className='form-control' value={phone} disabled={editAble} />
                            </div>
                        </div>
                    </div>
                    <div className='row m-y-1'>
                        <div className='col-xs-6'>
                            <label htmlFor='birhdate' className='col-xs-2'>Birth Date</label>
                            <div className='col-xs-8 form-horizontal'>
                                <input type='date' id='birthDate' className='form-control' value={birthDate} disabled={editAble}/>
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
                                        <input type='text' id='fines' className='form-control' value={fines} disabled={editAble} />
                                    </div>
                                </div>
                            </div>
                            <div id='div_tolls' className='inner-div-users-edit'>
                                <div className='form-group'>
                                    <label htmlFor='tolls' className='col-xs-2'>Tolls</label>
                                    <div className='col-xs-7'>
                                        <input type='text' id='tolls' className='form-control' value={tolls} disabled={editAble} />
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
    Meteor.subscribe('users')
    Meteor.subscribe('payments')
    let _id = params.id
    if(_id === 'new') {
        return {

        }
    } else {
        return {
            customer: Meteor.users.findOne({_id: _id}),
            payments: ApiPayments.find().fetch()
        }
    }
}, Customer)
