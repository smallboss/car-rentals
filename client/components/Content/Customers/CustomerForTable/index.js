/**
 * Created by watcher on 10/5/16.
 */
import React from 'react'
import { Link } from 'react-router'
import './style.css'

class CustomerForTable extends React.Component {
    render () {
        let { _id, name, userName, email, birthDate, role } = this.props.customer_data
        let _href = '/customer/' + _id
        return (
            <tr className='tr-href'>
                <td><input type='checkbox' id={_id} name='checkbox-for-delete' onChange={this.props.handlerDeleteCustomer} /></td>
                <td><Link to={_href}>{name}</Link></td>
                <td>{userName}</td>
                <td>{email}</td>
                <td>{birthDate}</td>
                <td>{role}</td>
            </tr>
        )
    }
}

export default CustomerForTable