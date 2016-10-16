/**
 * Created by watcher on 10/11/16.
 */
import React from 'react'
import { browserHistory } from 'react-router'
import { Link } from 'react-router'
import './style.css'

class LoginButtons extends React.Component {
    constructor(props) {
        super(props)
        this.state = {error: '', showModal: 0}
        this.loginHandler = this.loginHandler.bind(this)
    }
    loginHandler (e) {
        e.preventDefault()
        let username = e.target['username'].value,
            password = e.target['password'].value
        Meteor.loginWithPassword(username, password, (error) => {
            if(error) {
                this.setState({error: error.reason})
            } else {
                Meteor.loggingIn();
                browserHistory.push('/user_profile')
                this.setState({error: '', showModal: 0})
            }
        })
    }
    render () {
        let classModal = (this.state.showModal) ? 'modal show' : 'modal fade'            
        return (
            <div>
                <Link className='navbar-link btn btn-large btn-default m-x-1' to='/registration'>Register</Link>
                <input type='button' className='btn btn-large btn-default' role='button' onClick={() => this.setState({showModal: 1})} value='Sign In' />
                <div id='loginModal' className={classModal}>
                    <div className='overlay'></div>
                    <div className='modal-dialog modal-sm'>
                        <div className='modal-content p-a-1'>
                            <div>
                                <span>{this.state.error}</span>
                                <span className='close close-span' onClick={() => this.setState({showModal: 0})}>x</span><br />
                            </div><div className='clearfix'></div>
                            <form onSubmit={this.loginHandler}>
                                <div className='row'>
                                    <div className='form-group p-a-1'>
                                        <label htmlFor='username' className='col-xs-2'>Email:</label>
                                        <div className='col-xs-10'>
                                            <input type='text' id='username' className='form-control m-l-1' name='username' required />
                                        </div>                                        
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='form-group p-a-1'>
                                        <label htmlFor='password' className='col-xs-2'>Password:</label>
                                        <div className='col-xs-10'>
                                            <input type='password' id='password' className='form-control m-l-1' name='password' required />
                                        </div>                                        
                                    </div>
                                </div>
                                <input type='submit' className='btn btn-success pull-right m-y-1' value='Sign In'/>
                            </form>
                        </div>
                    </div>                    
                </div>
            </div>
        )
    }
}

export default LoginButtons