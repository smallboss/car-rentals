/**
 * Created by watcher on 10/5/16.
 */
import React from 'react'
import { Link } from 'react-router'
import './style.css'

class CustomerForTable extends React.Component {
    render () {
        console.log(this.props.customer_data)
        let { _id, username} = this.props.customer_data
        let email = this.props.customer_data.emails[0].address
        let name = this.props.customer_data.profile.name
        let _href = '/customer/' + _id
        return (
            <tr className='tr-href'>
                <td><input type='checkbox' id={_id} name='checkbox-for-delete' onChange={this.props.handlerDeleteCustomer} /></td>
                <td><Link to={_href}>{username}</Link></td>
                <td>{name}</td>                
                <td>{email}</td>                
            </tr>
        )
    }
}

export default CustomerForTable