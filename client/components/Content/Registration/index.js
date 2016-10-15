/**
 * Created by watcher on 10/4/16.
 */
import React from 'react'
import { Mongo } from 'meteor/mongo'
import { Accounts } from 'meteor/accounts-base'
import { createContainer } from 'meteor/react-meteor-data'
//import { ApiCustomers } from '../../../../imports/api/customers'
import { imgToBase64 } from '../../../helpers/handlerImages'

function createUser (data) {}

class Registration extends React.Component {
    addUserHandler (e) {
        e.preventDefault()
        /*Check passwords start*/
        if(e.target[6].value.length < 6) {
            alert('Password must be large then 6 symbols')
            return false
        }
        if (e.target[6].value != e.target[7].value){
            alert('Введенные пароли не совпадают');
            return false
        }

        /*Check passwords end*/
        /*Create must have variable start*/
        let _target = e.target,
            _user,
            _images = {
                imgId: '',
                imgLicense: ''
            }
        let fileId = _target[8].files[0] || '',
            fileLicense = _target[9].files[0] || ''
        _user = {
            id: new Mongo.ObjectID(),
            username: _target[1].value,
            email: _target[2].value,
            password: _target[6].value,
            profile: {
                userType: 'customer',
                name: _target[0].value,
                birthDate: _target[3].value,
                phone: _target[4].value,
                address: _target[5].value,
                carRequest: [
                    {
                        _id: new Mongo.ObjectID(),
                        dateCreateRequest: '',
                        dateFrom: '',
                        dateTo: '',
                        requestText: ''
                    }
                ],
                rentals: [
                    {
                        _id: new Mongo.ObjectID(),
                        carId: '',
                        dateFrom: '',
                        dateTo: ''
                    }
                ],
                payments: [
                    {
                        _id: new Mongo.ObjectID(),
                        datePayment: '',
                        statePayment: '',
                        QuantityPayment: ''
                    }
                ],
                fines: '',
                tolls: '',
                _images
            }            
        }
        /*Create must have variable end*/
        /*handle images if they are start*/
        if(typeof fileId != 'string' || typeof fileLicense != 'string') {
            if(fileId.size > 1100000 || fileLicense.size > 1100000) {
                alert('Please upload image less than 1mb')
                e.preventDefault()
                return false
            }
            if(typeof fileId == 'object' && (fileId.type != 'image/png' && fileId.type != 'image/jpeg')) {
                alert('Please upload Id image png or jpeg')
                _target[8].innerHTML = ''
                e.preventDefault()
                return false
            }
            if(typeof fileLicense == 'object' && (fileLicense.type != 'image/png' && fileLicense.type != 'image/jpeg')) {
                alert('Please upload License image png or jpeg')
                _target[9].innerHTML = ''
                e.preventDefault()
                return false
            }
            if (typeof fileId != 'string') {
                imgToBase64(fileId, (base64Id) => {
                    _user.profile._images.imgId = base64Id
                    if(typeof fileLicense != 'string') {
                        imgToBase64(fileLicense, (base64License) => {
                            _user.profile._images.imgLicense = base64License
                            //Meteor.call('createNewUser', _user, () => {
                            //    alert('You have register. You can enter with your login and password')
                            //})
                            Accounts.createUser(_user, (err) => {
                                console.log(err);
                            });
                            /*Accounts.createUser(_user, (err) => {
                                if(err) {
                                    alert(err.reason)
                                } else {
                                    alert('You have register. You can enter with your login and password')
                                }
                            })*/
                            _target.reset()
                        })
                    } else {
                        //Meteor.call('createNewUser', _user, () => {
                        //    alert('You have register. You can enter with your login and password')
                        //})
                        Accounts.createUser(_user, (err) => {
                            console.log(err);
                        });
                        /*Accounts.createUser(_user, (err) => {
                         if(err) {
                         alert(err.reason)
                         } else {
                         alert('You have register. You can enter with your login and password')
                         }
                         })*/
                        _target.reset()
                    }
                })
            } else if (typeof fileId == 'string' && typeof fileLicense != 'string') {
                imgToBase64(fileLicense, (base64License) => {
                    _user.profile._images.imgLicense = base64License
                    //Meteor.call('createNewUser', _user, () => {
                    //    alert('You have register. You can enter with your login and password')
                    //})
                    Accounts.createUser(_user, (err) => {
                        console.log(err);
                    });
                    /*Accounts.createUser(_user, (err) => {
                     if(err) {
                     alert(err.reason)
                     } else {
                     alert('You have register. You can enter with your login and password')
                     }
                     })*/
                    _target.reset()                    
                })                
            } 
        } /*handle with images if they are end*/ else {
            //Meteor.call('createNewUser', _user, () => {
            //    alert('You have register. You can enter with your login and password')
            //})
            Accounts.createUser(_user, (err) => {
                console.log(err);
            });
            /*Accounts.createUser(_user, (err) => {
             if(err) {
             alert(err.reason)
             } else {
             alert('You have register. You can enter with your login and password')
             }
             })*/
            _target.reset()
        }
        


        /*
        let _id = new Mongo.ObjectID(),
            _target = e.target,
            _user,
            _images
        let fileId = _target[8].files[0] || false,
            fileLicense = _target[9].files[0] || false
        if(fileId || fileLicense) {
            if(fileId.size > 1100000 || fileLicense.size > 1100000) {
                alert('Please upload image less than 1mb')
                e.preventDefault()
                return false
            }
            imgToBase64(fileId, (base64Id) => {
                imgId = base64Id
                imgToBase64(fileLicense, (base64License) => {
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
        } else {
            _images = {
                imgId: '',
                imgLicense: ''
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
        }*/
        
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
                        <input type='date' id='birth_date' className='form-control'  />
                    </div>
                </div><br />
                <div className='form-group'>
                    <label htmlFor='phone_number' className='control-label col-xs-2'>Phone Number</label>
                    <div className='col-xs-10'>
                        <input type='text' id='phone_number' className='form-control'  />
                    </div>
                </div><br />
                <div className='form-group'>
                    <label htmlFor='address' className='control-label col-xs-2'>Address</label>
                    <div className='col-xs-10'>
                        <input type='text' id='address' className='form-control'  />
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
                    <label htmlFor='imgId' className='control-label col-xs-2'>Upload ID</label>
                    <div className='col-xs-10'>
                        <input type='file' id='imgId' className='form-control' />
                    </div>
                </div><br />
                <div className='form-group'>
                    <label htmlFor='imgLicense' className='control-label col-xs-2'>Upload License</label>
                    <div className='col-xs-10'>
                        <input type='file' id='imgLicense' className='form-control' />
                    </div>
                </div><br />
                <input type='submit' className='btn btn-success' value='Register' />
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

/*function toDataUrl(url, callback) {
 console.log(url)
 let file = url
 let reader = new FileReader()
 if(file) {
 reader.readAsDataURL(file)
 }
 reader.onloadend = () => {
 console.log(reader.result)
 }

 }
*/