/**
 * Created by watcher on 10/5/16.
 */
import React from 'react'
import { Link } from 'react-router'
import './style.css'

class UserForTable extends React.Component {
    render () {
        let { _id, username} = this.props.user_data
        let email = this.props.user_data.emails[0].address
        let { name, phone } = this.props.user_data.profile
        let userType = this.props.user_data.profile.userType
        let _href = '/managePanel/user_single/' + _id
        return (
            <tr className='tr-href'>
                <td><input type='checkbox' id={_id} name='checkbox-for-delete' onChange={this.props.handlerDeleteUser} /></td>
                <td><Link to={_href}>{username}</Link></td>
                <td>{name}</td>                
                <td>{email}</td>                
                <td>{phone}</td>                
                <td>{userType}</td>                
            </tr>
        )
    }
}

export default UserForTable