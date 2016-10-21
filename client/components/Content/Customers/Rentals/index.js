/**
 * Created by watcher on 10/8/16.
 */
import React from 'react'
import { Link } from 'react-router'
import { Mongo } from 'meteor/mongo'

class Rentals extends React.Component {
    constructor (props) {
        super(props)
        this.state = {rentals: props.rentals || []}
    }
    componentWillReceiveProps(nextProps){
        this.setState({rentals: nextProps.rentals})
    }
    render () {
        return (
            <div>
                <table className='table table-hover table-bordered m-y-1'>
                    <thead>
                    <tr>
                        <th>Car</th>
                        <th>Date From</th>
                        <th>Date To</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.rentals.map(item => {
                        let { car, dateFrom, dateTo } = item
                        return (
                            <tr key={Math.random()}>
                                <td><Link to={'/managePanel/cars/' + car._str}>{car._str}</Link></td>
                                <td>{dateFrom}</td>
                                <td>{dateTo}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Rentals

