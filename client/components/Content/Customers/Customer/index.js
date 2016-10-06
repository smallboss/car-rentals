/**
 * Created by watcher on 10/5/16.
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiCustomers } from '../../../../../imports/api/customers'
import React from 'react'
import $ from 'jquery'
import './style.css'

class Customer extends React.Component {
    constructor (props) {
        super(props)
        this.state = {customer: this.props.customer}        
    }
    componentWillMount () {
        let customer = this.props.customer || []
        if(customer.length > 0) {
            this.setState({customer: customer[0]})   
        }        
    }
    componentDidMount () {
        [...document.getElementsByClassName('li-nav')].forEach(li => {
            li.addEventListener('click', this.handlerNavUserEdit)
        })
    }
    componentWillReceiveProps (nextProps) {
        console.log(nextProps)
        let customer = nextProps.customer
        this.setState({customer: customer[0]})
    }
    handlerNavUserEdit (e) {
        let li_s = $('.nav-user-edit li').removeClass('active-href-nav')
        $(this).addClass('active-href-nav')
    }
    render () {
        console.log(this.state.customer)
        let { name, userName, address, email, birthDate, phone, role, _images} = this.state.customer,
            imgId,
            imgLicense
        if (_images) {
            imgId = _images.imgId.replace('text/html', 'image/png')
            imgLicense = _images.imgLicense.replace('text/html', 'image/png')

            $("<img>", {
                'src': imgId,
                'width': '250px', 
                'height': '250px'})
                .appendTo('#img_preview');
            
        }            
        return (
            <div className='panel panel-default'>
                <div className='panel-heading'>
                    <h4>{name} / {userName}</h4>
                    <input type='button' className='btn btn-primary p-x-1' value='Print' />
                    <input type='button' className='btn btn-primary p-x-1 m-x-1' value='Save' />
                    <input type='button' className='btn btn-primary p-x-1' value='Edit' />
                    <input type='button' className='btn btn-primary p-x-1 m-x-1' value='Delete' />
                </div>
                <div className='panel-body'>
                    <div className='row'>
                        <div className='col-xs-6'>
                            <label htmlFor='name' className='col-xs-2'>Name</label>
                            <div className='col-xs-8 form-horizontal'>
                                <input type='text' className='form-control' value={name} readOnly/>
                            </div>
                        </div>
                        <div className='col-xs-6'>
                            <label htmlFor='address' className='col-xs-2'>Address</label>
                            <div className='col-xs-8 form-horizontal'>
                                <input type='text' className='form-control' value={address} readOnly/>
                            </div>
                        </div>
                    </div>
                    <div className='row m-y-1'>
                        <div className='col-xs-6'>
                            <label htmlFor='phone' className='col-xs-2'>Phone</label>
                            <div className='col-xs-8 form-horizontal'>
                                <input type='text' className='form-control' value={phone} readOnly/>
                            </div>
                        </div>
                        <div className='col-xs-6'>
                            <label htmlFor='email' className='col-xs-2'>Email</label>
                            <div className='col-xs-8 form-horizontal'>
                                <input type='text' className='form-control' value={email} readOnly/>
                            </div>
                        </div>
                    </div>
                    <div className='row m-y-1'>
                        <div className='col-xs-6'>
                            <label htmlFor='birhdate' className='col-xs-2'>Birth Date</label>
                            <div className='col-xs-8 form-horizontal'>
                                <input type='text' className='form-control' value={birthDate} readOnly/>
                            </div>
                        </div>
                        <div className='col-xs-6'>

                        </div>
                    </div>
                    <div className='row m-y-1'>
                        <div className='col-xs-12'>
                            <ul className='nav nav-tabs nav-user-edit'>
                                <li role='presentation' className='li-nav active-href-nav' name='div_scans'><a>Scans</a></li>
                                <li role='presentation' className='li-nav'><a>Car Request</a></li>
                                <li role='presentation' className='li-nav'><a>Rentals</a></li>
                                <li role='presentation' className='li-nav'><a>Payments</a></li>
                                <li role='presentation' className='li-nav'><a>Fines</a></li>
                                <li role='presentation' className='li-nav'><a>Tolls</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-xs-12'>
                            <div id='div_scans'>
                                <div id='img_preview'></div>
                                <img src={imgId} style={{width: '100px', height: '100px'}} />
                                <img src={imgLicense} />
                                {imgId}
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
    return {
        customer: ApiCustomers.find({_id: new Mongo.ObjectID(_id)}).fetch()        
    }
}, Customer)