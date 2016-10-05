/**
 * Created by watcher on 10/5/16.
 */
import React from 'react'

class CustomerForTable extends React.Component {
    render () {
        let { name, userName, email, birthDate, role } = this.props.customer_data
        return (
            <tr>
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