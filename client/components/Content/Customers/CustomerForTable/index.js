/**
 * Created by watcher on 10/5/16.
 */
import React from 'react'
import './style.css'

class CustomerForTable extends React.Component {
    render () {
        let { _id, name, userName, email, birthDate, role } = this.props.customer_data
        return (
            <tr className='tr-href' onClick={() => {this.props.routerToCustomer(_id._str)}}>
                <td>{name}</td>
                <td>{userName}</td>
                <td>{email}</td>
                <td>{birthDate}</td>
                <td>{role}</td>
            </tr>
        )
    }
}

export default CustomerForTable