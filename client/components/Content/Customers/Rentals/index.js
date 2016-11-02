/**
 * Created by watcher on 10/8/16.
 */
import React from 'react'
import { Link } from 'react-router'

class Rentals extends React.Component {
    constructor (props, context) {
        super(props)
        this.state = {loginLevel: context.loginLevel, rentals: props.rentals || []}
    }
    componentWillReceiveProps(nextProps, nextContext){
        this.setState({rentals: nextProps.rentals, loginLevel: nextContext.loginLevel})        
    }
    render () {
        return (
            <div>
                <table className='table table-hover table-bordered m-y-1'>
                    <thead>
                    <tr>
                        <th>Car Plate</th>
                        <th>Date From</th>
                        <th>Date To</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.rentals.map(item => {
                        let { car, plateNumber, dateFrom, dateTo } = item
                        return (
                            <tr key={Math.random()}>
                                <td>{(this.state.loginLevel === 2 || this.state.loginLevel === 3) ? <Link to={'/managePanel/cars/' + car._str}>{plateNumber}</Link> : <span>{plateNumber}</span>}</td>
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

Rentals.contextTypes = {
    loginLevel: React.PropTypes.number.isRequired
}

export default Rentals
