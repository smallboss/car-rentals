/**
 * Created by watcher on 10/11/16.
 */
import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { createContainer } from 'meteor/react-meteor-data'

class UserProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {user: props.user, editAble: 0}
        this.handlerButtonsEdit = this.handlerButtonsEdit.bind(this)
        this.handlerInputs = this.handlerInputs.bind(this)
    }
    componentWillReceiveProps (nextProps) {
        this.setState({user: nextProps.user})
    }
    handlerInputs (e) {
        let _newUser = this.state.user,
            _target = e.target.id,
            _newValue = e.target.value
        if(typeof _newValue == 'string') {
            if (_target == 'email') {
                _newUser.emails[0].address = _newValue
            } else {
                _newUser.profile[_target] = _newValue
            }            
        }
        this.setState({user: _newUser})        
    }
    handlerButtonsEdit (e) {
        let _nameButton = e.target.name,
            _сurrentState = this.state.user,
            _id = this.state.user._id
        switch (_nameButton) {
            case 'editButton':
                this.setState({editAble: 1});
                for(let i = 0; i < this.refFormEdit.length; i++) {
                    this.refFormEdit[i].addEventListener('input', this.handlerInputs)
                }
                this.refButtonSave.addEventListener('click', this.handlerButtonsEdit)
                break
            case 'saveButton':
                delete this.state.user._id
                Meteor.users.update(_id, {$set: _сurrentState})
                this.setState({editAble: 0})
                break
            default:
                break
        }
        
    }
    render () {
        let editAble = (!this.state.editAble) ? 'disabled' : false
        let { username, emails, profile } = this.state.user || '',
            email = (emails) ? emails[0].address : ''
        let { userType, name, birthDate, phone, address } = (profile) ? profile : ''
        return (
            <div>
                <div className='panel panel-default'>
                    <div className='panel-heading'>
                        <h4>{username} / {name}</h4>
                        <input type='button' name='editButton' className='btn btn-primary p-x-1' value='Edit' onClick={this.handlerButtonsEdit} />
                        <input type='button' name='saveButton' className='btn btn-primary p-x-1 m-x-1' ref={(ref) => this.refButtonSave = ref} value='Save' disabled={editAble} />
                    </div>
                    <div className='col-xs-6 panel-body'>
                        <form className='form-horizontal text-left edit-user-form' ref={(ref) => {this.refFormEdit = ref}} >
                            <div className='form-group'>
                                <label htmlFor='username' className='control-label col-xs-2'>User Name</label>
                                <div className='col-xs-10'>
                                    <input type='text' id='username' className='form-control' value={username} disabled />
                                </div>
                            </div><br />
                            <div className='form-group'>
                                <label htmlFor='name' className='control-label col-xs-2'>Name</label>
                                <div className='col-xs-10'>
                                    <input type='text' id='name' className='form-control' value={name} disabled={editAble} />
                                </div>
                            </div><br />
                            <div className='form-group'>
                                <label htmlFor='email' className='control-label col-xs-2'>Email</label>
                                <div className='col-xs-10'>
                                    <input type='email' id='email' className='form-control' value={email} disabled={editAble}  />
                                </div>
                            </div><br />
                            <div className='form-group'>
                                <label htmlFor='phone' className='control-label col-xs-2'>Phone Number</label>
                                <div className='col-xs-10'>
                                    <input type='text' id='phone' className='form-control' value={phone} disabled={editAble}  />
                                </div>
                            </div><br />
                            <div className='form-group'>
                                <label htmlFor='address' className='control-label col-xs-2'>Address</label>
                                <div className='col-xs-10'>
                                    <input type='text' id='address' className='form-control' value={address} disabled={editAble} />
                                </div>
                            </div><br />                                                   
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

UserProfile.propTypes = {
    user: React.PropTypes.object.isRequired
}


export default createContainer(() => {
    Meteor.subscribe('users')
    let _id = Session.get('user')
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