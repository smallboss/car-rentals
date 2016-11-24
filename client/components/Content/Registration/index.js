/**
 * Created by watcher on 10/4/16.
 */
import React from 'react'
import { Mongo } from 'meteor/mongo'
import { createContainer } from 'meteor/react-meteor-data'
import { imgToBase64 } from '../../../helpers/handlerImages'
import LoginButtons from '../Login/LoginButtons'
import './style.css'
const DatePicker = require('react-bootstrap-date-picker')

class Registration extends React.Component {
    constructor(props) {
        super(props)
        this.state = {toShowLogin: 0}
        this.addUserHandler = this.addUserHandler.bind(this)
    }
    addUserHandler (e) {
        e.preventDefault()
        /*Check passwords start*/
        let formTarget = e.target
        if(formTarget['password'].value.length < 6) {
            alert('Password must be large then 6 symbols')
            return false
        }
        if (formTarget['password'].value != formTarget['repeat_password'].value){
            alert('Password repeat must be equal password');
            return false
        }
        /*Check passwords end*/
        /*Create must have variable start*/
        let _user,
            _images = {
                imgId: '',
                imgLicense: '',
                imgUser: ''
            }
        let fileId = formTarget['imgId'].files[0] || '',
            fileLicense = formTarget['imgLicense'].files[0] || ''
        _user = {
            id: new Mongo.ObjectID(),
            username: formTarget['user_name'].value,
            email: formTarget['email'].value,
            password: formTarget['password'].value,
            profile: {
                userType: 'customer',
                name: formTarget['name'].value,
                birthDate: this.rNewFieldBirthDate.state.value.slice(0, 10),
                phone: formTarget['phone_number'].value,
                address: formTarget['address'].value,
                carRequest: [
                    /*{
                        _id: new Mongo.ObjectID(),
                        dateCreateRequest: '',
                        dateFrom: '',
                        dateTo: '',
                        requestText: ''
                    }*/
                ],
                rentals: [],
                payments: [],                
                _images
            }            
        }
        let checkBirthYear = +_user.profile.birthDate.slice(0, 4),
            checkBirthMonth = +_user.profile.birthDate.slice(5, 7),
            checkBirthDay = +_user.profile.birthDate.slice(9, 11),
            _date = new Date()
        if(checkBirthYear > _date.getFullYear() - 18) {
            alert('You must be over then 18 years')
            return            
        } else if (checkBirthYear == _date.getFullYear() - 18) {
            if(checkBirthMonth > _date.getMonth() + 1) {
                alert('You must be over then 18 years')
                return
            } else if (checkBirthMonth == _date.getMonth() + 1) {
                if(checkBirthDay > _date.getDay() - 1) {
                    alert('You must be over then 18 years')
                    return
                }   
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
                formTarget['imgId'].innerHTML = ''
                e.preventDefault()
                return false
            }
            if(typeof fileLicense == 'object' && (fileLicense.type != 'image/png' && fileLicense.type != 'image/jpeg')) {
                alert('Please upload License image png or jpeg')
                formTarget['imgLicense'].innerHTML = ''
                e.preventDefault()
                return false
            }
            if (typeof fileId != 'string') {
                imgToBase64(fileId, (base64Id) => {
                    _user.profile._images.imgId = base64Id
                    if(typeof fileLicense != 'string') {
                        imgToBase64(fileLicense, (base64License) => {
                            _user.profile._images.imgLicense = base64License
                            Meteor.call('createNewUser', _user, (err, result) => {
                                if(err) {
                                    alert(err.reason)
                                } else {
                                    alert('You have register. You can enter with your login and password')
                                    formTarget.reset()           
                                    this.setState({toShowLogin: 1})
                                }
                            })
                        })
                    } else {
                        Meteor.call('createNewUser', _user, (err, result) => {
                            if(err) {
                                alert(err.reason)
                            } else {
                                alert('You have register. You can enter with your login and password')
                                formTarget.reset()
                                this.setState({toShowLogin: 1})
                            }
                        })
                    }
                })
            } else if (typeof fileId == 'string' && typeof fileLicense != 'string') {
                imgToBase64(fileLicense, (base64License) => {
                    _user.profile._images.imgLicense = base64License
                    Meteor.call('createNewUser', _user, (err, result) => {
                        if(err) {
                            alert(err.reason)
                        } else {
                            alert('You have register. You can enter with your login and password')
                            formTarget.reset()
                            this.setState({toShowLogin: 1})
                        }
                    })

                })                
            } 
        } /*handle with images if they are end*/ else {
            Meteor.call('createNewUser', _user, (err, result) => {
                if(err) {
                    alert(err.reason)
                } else {
                    alert('You have register. You can enter with your login and password')
                    formTarget.reset()
                    this.setState({toShowLogin: 1})
                }
            })
        }
    }
    render () {
        if(this.state.toShowLogin) {
            return (
                <LoginButtons toShowModal={1} />
            )
        }
        var dateForPicker = new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString()
        return (
            <div className='text-center'>
                <form className='form-horizontal text-left add-user-form' onSubmit={this.addUserHandler} encType='multipart/form-data'>
                    <h3>Register user</h3>
                    <div className='form-group'>
                        <label htmlFor='name' className='control-label col-xs-2'>Name</label>
                        <div className='col-xs-10'>
                            <input type='text' name='name' className='form-control' required />
                        </div>
                    </div><br />
                    <div className='form-group'>
                        <label htmlFor='user_name' className='control-label col-xs-2'>User Name</label>
                        <div className='col-xs-10'>
                            <input type='text' name='user_name' className='form-control' required onKeyDown={(e) => {if (e.keyCode == 32) {alert('Spaces are not allowed'); e.preventDefault()}}}
                                   onChange={(e) => {if(e.target.value.indexOf(' ') !== -1) {e.target.value = e.target.value.replace(/ /g, '')}}}
                            />
                        </div>
                    </div><br />
                    <div className='form-group'>
                        <label htmlFor='email' className='control-label col-xs-2'>Email</label>
                        <div className='col-xs-10'>
                            <input type='email' name='email' className='form-control' required />
                        </div>
                    </div><br />
                    <div className='form-group'>
                        <label htmlFor='birth_date' className='control-label col-xs-2'>Birth Date</label>
                        <div className='col-xs-10'>
                            <DatePicker dateFormat='MM/DD/YYYY' value={dateForPicker} ref={ref => {this.rNewFieldBirthDate = ref}} />
                        </div>
                    </div><br />
                    <div className='form-group'>
                        <label htmlFor='phone_number' className='control-label col-xs-2'>Phone Number</label>
                        <div className='col-xs-10'>
                            <input type='text' name='phone_number' className='form-control'  maxLength='15' />
                        </div>
                    </div><br />
                    <div className='form-group'>
                        <label htmlFor='address' className='control-label col-xs-2'>Address</label>
                        <div className='col-xs-10'>
                            <input type='text' name='address' className='form-control'  />
                        </div>
                    </div><br />
                    <div className='form-group'>
                        <label htmlFor='password' className='control-label col-xs-2'>Password</label>
                        <div className='col-xs-10'>
                            <input type='password' name='password' className='form-control' required />
                        </div>
                    </div><br />
                    <div className='form-group'>
                        <label htmlFor='repeat_password' className='control-label col-xs-2'>Repeat password</label>
                        <div className='col-xs-10'>
                            <input type='password' name='repeat_password' className='form-control' required />
                        </div>
                    </div><br />
                    <div className='form-group'>
                        <label htmlFor='imgId' className='control-label col-xs-2'>Upload ID</label>
                        <div className='col-xs-10'>
                            <input type='file' name='imgId' className='form-control' />
                        </div>
                    </div><br />
                    <div className='form-group'>
                        <label htmlFor='imgLicense' className='control-label col-xs-2'>Upload License</label>
                        <div className='col-xs-10'>
                            <input type='file' name='imgLicense' className='form-control' />
                        </div>
                    </div><br />
                    <input type='submit' className='btn btn-success' value='Register' />
                </form>
            </div>
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