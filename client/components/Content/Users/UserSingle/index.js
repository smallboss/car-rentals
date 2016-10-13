/**
 * Created by watcher on 10/12/16.
 */
import React from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'

class UserSingle extends React.Component {
    constructor (props) {
        super(props)
        this.state = {user: props.user, editAble: 0}
        this.handlerEditUser = this.handlerEditUser.bind(this)        
    }
    componentWillReceiveProps (nextProps) {
        let user = nextProps.user,
            _newStateEdit
        _newStateEdit = (user.profile.userType == 'admin') ? 1 : 0
        this.setState({user: user, editAble: _newStateEdit})
        this.forceUpdate()
    }
    handlerNavUserEdit (e) {
        let li_s = $('.nav-user-edit li').removeClass('active-href-nav'),
            _target = $(this).data('target')
        $(this).addClass('active-href-nav')
        $('.inner-div-users-edit').hide()
        $('#' + _target).show()
    }
    handlerRemoveuser (id) {
        let _confirm = confirm('Are You sure to delete this user?')
        if(_confirm) {
            Meteor.users.remove({_id: id})
            browserHistory.push('/users_list')
        }
    }
    handlerEditUser (e) {
        let id = e.target.id,
            _newState = this.state.user,
            _objToSend
        const _id = this.state.user._id
        switch (id) {
            case 'button_edit':
                this.setState({editAble: 1});
                [...document.getElementsByClassName('form-control')].forEach(input => {
                    input.addEventListener('input', (eInput) => {
                        let user = this.state.user,
                            _target = eInput.target.id,
                            _newValue = eInput.target.value
                        if(!user.profile) {
                            user.profile = {}
                            user.emails = [{}]
                        }
                        if(typeof _newValue == 'string') {
                            if (_target == 'username') {
                                user[_target] = _newValue
                            } else {
                                if (_target == 'email') {
                                    if(this.props.params.id == 'new') {
                                        user[_target] = _newValue
                                        user.emails[0].address = _newValue
                                    } else {
                                        user.emails[0].address = _newValue
                                    }
                                } else if (_target !== 'password' && _target !== 'repeat_password'){
                                    user.profile[_target] = _newValue
                                }
                            }
                            this.setState({user: user})
                        }
                    })
                })
                document.getElementById('button_save').addEventListener('click', this.handlerEditUser)
                break
            case 'button_save':
                delete _newState._id
                Meteor.users.update(_id, {$set: _newState}, false, (err, result) => {
                    this.setState({editAble: 0})
                    if(err) {
                        console.log(err)
                    } else {
                        if(this.refPassword.value !== this.refRepeatPassword.value) {
                            alert('Input right repeat password please')
                            return false
                        } else if (this.refPassword.value.length > 0) {
                            _newValue = this.refPassword.value
                            if(_newValue.length < 6) {
                                alert('Password must be large then 6 symbols')
                                return false
                            }
                            _objToSend = { targetId: _id, newPassword: _newValue }
                            Meteor.call('setNewPassword', _objToSend, function (err, result) {
                                if(!err) {
                                    alert('Password has been change')
                                } else {
                                    console.log(err)
                                }
                            })
                        }
                    }
                })
                break
            default:
                break
        }
    }
    handlerChildState(target, data) {
        let _state = this.state.user,
            _id = this.state.user._id
        _state.profile[target] = data
        delete this.state.user._id
        Meteor.users.update(_id, {$set: _state})
    }
    render () {
        let editAble = (!this.state.editAble) ? 'disabled' : false
        let { _id, username } = this.state.user || [];
        let email = (this.state.user && this.state.user.emails) ? this.state.user.emails[0].address : ''
        let { name, userType } = (this.state.user) ? this.state.user.profile : '';

        return (
            <div className='panel panel-default'>
                <div className='panel-heading'>
                    <h4>{username} / {name}</h4>
                    <input type='button' id='button_save' className='btn btn-primary p-x-1 m-x-1' value='Save' disabled={editAble} />
                    <input type='button' id='button_edit' className='btn btn-primary p-x-1' value='Edit' onClick={this.handlerEditUser} />                    
                </div>
                <div className='panel-body'>
                    <div className='col-xs-6'>
                        <div className='row m-t-1'>
                            <div className='form-group'>
                                <label htmlFor='username' className='col-xs-2'>User Name</label>
                                <div className='col-xs-8 form-horizontal'>
                                    <input type='text' id='username' className='form-control' value={username} disabled={editAble} />
                                </div>
                            </div>
                        </div>
                        <div className='row m-t-1'>
                            <div className='form-group '>
                                <label htmlFor='username' className='col-xs-2'>Name</label>
                                <div className='col-xs-8 form-horizontal'>
                                    <input type='text' id='name' className='form-control' value={name} disabled={editAble} />
                                </div>
                            </div>
                        </div>
                        <div className='row m-t-1'>
                            <div className='form-group'>
                                <label htmlFor='email' className='col-xs-2'>Email</label>
                                <div className='col-xs-8 form-horizontal'>
                                    <input type='email' id='email' className='form-control' value={email} disabled={editAble} />
                                </div>
                            </div>
                        </div>
                        <div className='row m-t-1'>
                            <div className='form-group'>
                                <label htmlFor='password' className='col-xs-2'>Password</label>
                                <div className='col-xs-8 form-horizontal'>
                                    <input type='password' id='password' className='form-control' ref={(ref) => {this.refPassword = ref}} disabled={editAble} />
                                </div>
                            </div>
                        </div>
                        <div className='row m-t-1'>
                            <div className='form-group'>
                                <label htmlFor='repeat_password' className='col-xs-2'>Repeat Password</label>
                                <div className='col-xs-8 form-horizontal'>
                                    <input type='password' id='repeat_password' className='form-control' ref={(ref) => {this.refRepeatPassword = ref}} disabled={editAble} />
                                </div>
                            </div>
                        </div>
                        <div className='row m-t-1'>
                            <div className='form-group'>
                                <label htmlFor='userType' className='col-xs-2'>Role</label>
                                <div className='col-xs-8 form-horizontal'>
                                    <select id='userType' className='form-control' value={userType} disabled={editAble}>
                                        <option value='customer'>Customer</option>
                                        <option value='employee'>Employee</option>
                                        <option value='admin'>Admin</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>
        )
    }
}

export default createContainer (({params}) => {
    let _id = params.id
    if(_id) {
        Meteor.subscribe('users')
        return {
            user: Meteor.users.findOne({_id: _id})
        }
    } else {
        return {
            user: false
        }
    }
}, UserSingle)
