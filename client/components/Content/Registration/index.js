/**
 * Created by watcher on 10/4/16.
 */
import React from 'react'
import { Mongo } from 'meteor/mongo'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiCustomers } from '../../../../imports/api/customers'

function toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.send();
}

class Registration extends React.Component {
    addUserHandler (e) {
        e.preventDefault()
        if (e.target[6].value != e.target[7].value){
            alert('Введенные пароли не совпадают');
            e.target.reset()
            return false
        }
        let _id = new Mongo.ObjectID(),
            _target = e.target,
            _user,
            _images
        toDataUrl(_target[8].files[0], (base64Id) => {
            imgId = base64Id
            toDataUrl(_target[9].files[0], (base64License) => {
                imgLicense = base64License
                _images = {
                    imgId,
                    imgLicense
                }
                _user = {
                    _id,
                    name: _target[0].value,
                    userName: _target[1].value,
                    email: _target[2].value,
                    birthDate: _target[3].value,
                    phone: _target[4].value,
                    address: _target[5].value,
                    password: _target[6].value,                    
                    role: 'customer',
                    _images
                }
                ApiCustomers.insert(_user)
                _target.reset()
            })
        })
    }
    render () {
        return (
            <form className='form-horizontal text-left add-user-form' onSubmit={this.addUserHandler} encType='multipart/form-data'>
                <h3>Register user</h3>
                <div className='form-group'>
                    <label htmlFor='name' className='control-label col-xs-2'>Name</label>
                    <div className='col-xs-10'>
                        <input type='text' id='name' className='form-control' required />
                    </div>
                </div><br />
                <div className='form-group'>
                    <label htmlFor='user_name' className='control-label col-xs-2'>User Name</label>
                    <div className='col-xs-10'>
                        <input type='text' id='user_name' className='form-control' required />
                    </div>
                </div><br />
                <div className='form-group'>
                    <label htmlFor='email' className='control-label col-xs-2'>Email</label>
                    <div className='col-xs-10'>
                        <input type='email' id='email' className='form-control' required />
                    </div>
                </div><br />
                <div className='form-group'>
                    <label htmlFor='birth_date' className='control-label col-xs-2'>Birth Date</label>
                    <div className='col-xs-10'>
                        <input type='date' id='birth_date' className='form-control' required />
                    </div>
                </div><br />
                <div className='form-group'>
                    <label htmlFor='phone_number' className='control-label col-xs-2'>Phone Number</label>
                    <div className='col-xs-10'>
                        <input type='text' id='phone_number' className='form-control' required />
                    </div>
                </div><br />
                <div className='form-group'>
                    <label htmlFor='address' className='control-label col-xs-2'>Address</label>
                    <div className='col-xs-10'>
                        <input type='text' id='address' className='form-control' required />
                    </div>
                </div><br />
                <div className='form-group'>
                    <label htmlFor='password' className='control-label col-xs-2'>Password</label>
                    <div className='col-xs-10'>
                        <input type='password' id='password' className='form-control' required />
                    </div>
                </div><br />
                <div className='form-group'>
                    <label htmlFor='repeat_password' className='control-label col-xs-2'>Repeat password</label>
                    <div className='col-xs-10'>
                        <input type='password' id='repeat_password' className='form-control' required />
                    </div>
                </div><br />
                <div className='form-group'>
                    <label htmlFor='img_id' className='control-label col-xs-2'>Upload ID</label>
                    <div className='col-xs-10'>
                        <input type='file' id='img_id' className='form-control' required />
                    </div>
                </div><br />
                <div className='form-group'>
                    <label htmlFor='img_license' className='control-label col-xs-2'>Upload License</label>
                    <div className='col-xs-10'>
                        <input type='file' id='img_license' className='form-control' required />
                    </div>
                </div><br />
                <input type='submit' className='btn btn-success' defaultValue='Add user' />
            </form>
        )
    }
}

export default Registration

/*export default createContainer(() => {
    Meteor.subscribe('images')
    return {
        images: Images.find({}).fetch()
    }
}, Registration)*/