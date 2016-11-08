/**
 * Created by watcher on 10/11/16.
 */
import React from 'react'
import { Meteor } from 'meteor/meteor'
import { browserHistory } from 'react-router'
import { createContainer } from 'meteor/react-meteor-data'
import { imgToBase64 } from '../../../helpers/handlerImages'
import LoginButtons from '../Login/LoginButtons'
import './style.css'

const DatePicker = require('react-bootstrap-date-picker')

class UserProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {user: props.user, editAble: 0, toShowLogin: (Meteor.userId()) ? 0 : 1}
        this.handlerButtonsEdit = this.handlerButtonsEdit.bind(this)
        this.handlerInputs = this.handlerInputs.bind(this)
        this.datePickerHandler = this.datePickerHandler.bind(this)
    }
    componentWillReceiveProps (nextProps) {
        this.setState({user: nextProps.user, toShowLogin: (Meteor.userId()) ? 0 : 1})
    }
    handlerInputs (e) {
        let _newUser = this.state.user,
            _target = e.target.id,
            _newValue = e.target.value
        if(e.target.type == 'file') {
            /* handler image start */
            let file = e.target.files[0],
                _target = e.target.id,
                _newFile,
                _images = {}
            if(file.size > 1100000) {
                alert('Please upload image less than 1mb')
                e.preventDefault()
                return false
            }
            if(file.type != 'image/png' && file.type != 'image/jpeg') {
                alert('Please upload image png or jpeg')
                e.preventDefault()
                return false
            }
            imgToBase64(file, (result) => {
                _newFile = result
                if(!_newUser.profile._images) {
                    _newUser.profile._images = {}
                }
                _newUser.profile._images[_target] = _newFile
                this.setState({user: _newUser})
            })
            /* handler image end */
            return
        }
        if(typeof _newValue == 'string') {
            if (_target == 'email') {
                _newUser.emails[0].address = _newValue
            } else if(_target !== 'password' && _target !== 'repeat_password') {
                _newUser.profile[_target] = _newValue
            }            
        }
        this.setState({user: _newUser})
    }
    handlerButtonsEdit (e) {
        let _nameButton = e.target.name,
            _сurrentState = this.state.user,
            _newValue,
            _id = this.state.user._id,
            _objToSend
        switch (_nameButton) {
            case 'editButton':
                this.setState({editAble: 1});
                for(let i = 0; i < this.refFormEdit.length; i++) {
                    if(this.refFormEdit[i].type != 'file') {
                        this.refFormEdit[i].addEventListener('input', this.handlerInputs)   
                    } else if(this.refFormEdit[i].type == 'file') {
                        this.refFormEdit[i].addEventListener('change', this.handlerInputs)
                    }                    
                }
                this.refButtonSave.addEventListener('click', this.handlerButtonsEdit)
                break
            case 'saveButton':
                delete _сurrentState._id
                Meteor.users.update(_id, {$set: _сurrentState}, false, (err, result) => {
                    if(err) {
                        console.log(err)
                    } else {
                        if(this.refFormEdit['password'].value !== this.refFormEdit['repeat_password'].value) {
                            alert('Input right repeat password please')
                            return false
                        } else if (this.refFormEdit['password'].value.length > 0) {
                            _newValue = this.refFormEdit['password'].value
                            if(_newValue.length < 6) {
                                alert('Password must be large then 6 symbols')
                                return false
                            }
                            _objToSend = { targetId: _id, newPassword: _newValue }
                            Meteor.call('setNewPassword', _objToSend, (err, result) => {
                                if(!err) {
                                    alert('Your password has been change. Sign in again please')
                                    this.setState({editAble: 0, toShowLogin: 1})                                    
                                } else {
                                    console.log(err)
                                }
                            })
                        }
                        this.setState({editAble: 0})                        
                    }
                })                
                break
            default:
                break
        }
        
    }
    datePickerHandler(date) {
        let checkBirthYear = +date.slice(0, 4),
            checkBirthMonth = +date.slice(5, 7),
            checkBirthDay = +date.slice(8, 10),
            _date = new Date(),
            defaultDate = new Date().setFullYear(new Date().getFullYear() - 18),
            user = this.state.user
        user.profile['birthDate'] = date.slice(0,10)
        if(checkBirthYear > _date.getFullYear() - 18) {
            alert('User must be over then 18 years')
            user.profile['birthDate'] = defaultDate
        } else if (checkBirthYear == _date.getFullYear() - 18) {
            if(checkBirthMonth > _date.getMonth() + 1) {
                alert('User must be over then 18 years')
                user.profile['birthDate'] = defaultDate
            } else if (checkBirthMonth == _date.getMonth() + 1) {
                if(checkBirthDay > _date.getDay() - 1) {
                    alert('User must be over then 18 years')
                    user.profile['birthDate'] = defaultDate
                }
            }
        }
        this.setState({user: user})
    }
    render () {
        if(this.state.toShowLogin) {
            return (
                <LoginButtons toShowModal={1} />
            )
        }
        if(!this.state.user) {
            return (
                <div>
                    Must be logined
                </div>
            )
        }
        let editAble = (!this.state.editAble) ? 'disabled' : false;
        let { username, emails, profile } = this.state.user || '',
            email = (emails) ? emails[0].address : '';
        let { userType, name, birthDate, phone, address, _images } = (profile) ? profile : '';
        let { imgId, imgLicense, imgUser } = _images || ''
        return (
            <div>
                <div className='panel panel-default'>
                    <div className='panel-heading'>
                        <h4>Customers / {name}</h4>
                        <input type='button' name='editButton' className='btn btn-primary p-x-1' value='Edit' onClick={this.handlerButtonsEdit} />
                        <input type='button' name='saveButton' className='btn btn-primary p-x-1 m-x-1' ref={(ref) => this.refButtonSave = ref} value='Save' disabled={editAble} />
                    </div>
                    <div className='col-xs-6 panel-body'>
                        <form className='form-horizontal text-left edit-user-form' ref={(ref) => {this.refFormEdit = ref}} >
                            <div className='form-group'>
                                <label htmlFor='username' className='col-xs-4'>User Name</label>
                                <div className='col-xs-8'>
                                    <input type='text' id='username' className='form-control' value={username} disabled />
                                </div>
                            </div><br />
                            <div className='form-group'>
                                <label htmlFor='name' className='col-xs-4'>Name</label>
                                <div className='col-xs-8'>
                                    <input type='text' id='name' className='form-control' value={name} disabled={editAble} />
                                </div>
                            </div><br />
                            <div className='form-group'>
                                <label htmlFor='email' className='col-xs-4'>Email</label>
                                <div className='col-xs-8'>
                                    <input type='email' id='email' className='form-control' value={email} disabled={editAble}  />
                                </div>
                            </div><br />
                            <div className='form-group'>
                                <label htmlFor='phone' className='col-xs-4'>Phone Number</label>
                                <div className='col-xs-8'>
                                    <input type='text' id='phone' className='form-control' value={phone} maxLength='15' disabled={editAble}  />
                                </div>
                            </div><br />
                            <div className='form-group'>
                                <label htmlFor='address' className='col-xs-4'>Address</label>
                                <div className='col-xs-8'>
                                    <input type='text' id='address' className='form-control' value={address} disabled={editAble} />
                                </div>
                            </div><br />
                            <div className='form-group'>
                                <label htmlFor='birthdate' className='col-xs-4'>Birth Date</label>
                                <div className='col-xs-8'>
                                    <DatePicker dateFormat='MM/DD/YYYY' value={birthDate} name='check-picker' onChange={this.datePickerHandler} disabled={editAble} />
                                </div>
                            </div><br />
                            <div className='form-group'>
                                <label htmlFor='password' className='col-xs-4'>Password</label>
                                <div className='col-xs-8'>
                                    <input type='password' id='password' className='form-control' disabled={editAble}  />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label htmlFor='repeat_password' className='col-xs-4'>Repeat password</label>
                                <div className='col-xs-8'>
                                    <input type='password' id='repeat_password' className='form-control' disabled={editAble}  />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label htmlFor='imgId' className='col-xs-4'>Image ID</label>
                                <div className='col-xs-8'>
                                    <img src={imgId} />
                                    <input type='file' id='imgId' className='form-control' accept='image/*' disabled={editAble} />
                                </div>                                
                            </div>
                            <div className='form-group'>
                                <label htmlFor='imgLicense' className='col-xs-4'>Image License</label>
                                <div className='col-xs-8'>
                                    <img src={imgLicense} />
                                    <input type='file' id='imgLicense' className='form-control' accept='image/*' disabled={editAble} />
                                </div>                                
                            </div>
                            <div className='form-group'>
                                <label htmlFor='imgUser' className='col-xs-4'>Image User</label>
                                <div className='col-xs-8'>
                                    <img src={imgUser} />
                                    <input type='file' id='imgUser' className='form-control' accept='image/*' disabled={editAble} />
                                </div>                                
                            </div>                            
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

UserProfile.propTypes = {
    user: React.PropTypes.object
}


export default createContainer(() => {
    Meteor.subscribe('users')
    let _id = Meteor.userId()
    if(_id) {
        return {
            user: Meteor.users.findOne({_id: _id})
        }   
    } else {
        return {
            user: {}
        }
    } 
}, UserProfile)

//export default UserProfile