/**
 * Created by watcher on 10/4/16.
 */
import React from 'react'

class Registration extends React.Component {
    render () {
        return (
            <form className='form-horizontal text-left add-user-form' onSubmit={this.props.register}>
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
                    <label htmlFor='password' className='control-label col-xs-2'>Password</label>
                    <div className='col-xs-10'>
                        <input type='password' id='password' className='form-control' required />
                    </div>
                </div><br />
                <div className='form-group'>
                    <label htmlFor='repeat_password' className='control-label col-xs-2'>Repeat password</label>
                    <div className='col-xs-10'>
                        <input type='repeat_password' id='repeat_password' className='form-control' required />
                    </div>
                </div><br />
                <input type='submit' className='btn btn-success' defaultValue='Add user' />
            </form>
        )
    }
}

export default Registration