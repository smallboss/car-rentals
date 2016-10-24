/**
 * Created by watcher on 10/19/16.
 */
import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiTolls } from '/imports/api/tolls'
import './style.css'


class Tolls extends React.Component {
    constructor (props) {
        super(props)
        this.state = {tolls: props.tolls || [], showModalTolls: 0}        
    }
    componentWillReceiveProps(nextProps) {
        this.setState({tolls: nextProps.tolls})
    }
    render () {
        let classModal = (this.state.showModalTolls) ? 'modal show' : 'modal fade'
            /*total = this.state.tolls.reduce(function(prev, cur, index, arr) {
                return prev + cur.amount
            }, 0)*/
        return (
            <div>
                <div>
                    <div className='col-xs-2'>
                        <input type='button' className='btn btn-large btn-default' role='button' onClick={() => this.setState({showModalTolls: 1})} value='Show Tolls' />
                        <span className='m-l-2'>{this.state.tolls.length} rows</span>
                    </div>                                        
                </div>
                <div id='tollsModal' className={classModal}>
                    <div className='overlay'></div>
                    <div className='modal-dialog modal-lg'>
                        <div className='modal-content p-a-1'>
                            <span className='close close-span' onClick={() => {this.setState({showModalTolls: 0}); this.forceUpdate()}}>x</span><br />
                            <div className='clearfix'></div>
                            <div className='row p-l-1 text-center'>
                                <div className='col-xs-5 text-left'></div>
                                <div className='col-xs-2 text-center'>
                                    <span className='display-inherit'><h3>Tolls</h3></span>
                                </div>
                                <div className='col-xs-5'></div>
                            </div>
                            <table className='table table-hover table-bordered m-y-1'>
                                <thead>
                                <tr>
                                    <th className=''>Description</th>
                                    <th className=''>Fine Status</th>
                                    <th className=''>Amount</th>
                                    <th className=''>Fine Source</th>
                                    <th className=''>Fine Time</th>
                                    <th className=''>Fine Date</th>
                                    <th className=''>Fine ID</th>
                                    <th className=''>License Source</th>
                                    <th className=''>License Number</th>
                                    <th className=''>Plate Symbol</th>
                                    <th className=''>Plate Type</th>
                                    <th className=''>Plate Number</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.tolls.map(elem => {
                                    let { description, fineStatus, amount, fineSource, fineTime, fineDate, fineId, licenseSource, licenseNumber, plateSymbol, plateType, plateNumber } = elem
                                    return (
                                        <tr key={Math.random()}>
                                            <td>{description}</td>
                                            <td>{fineStatus}</td>
                                            <td>{amount}</td>
                                            <td>{fineSource}</td>
                                            <td>{fineTime}</td>
                                            <td>{fineDate}</td>
                                            <td>{fineId}</td>
                                            <td>{licenseSource}</td>
                                            <td>{licenseNumber}</td>
                                            <td>{plateSymbol}</td>
                                            <td>{plateType}</td>
                                            <td>{plateNumber}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default createContainer((params) => {
    Meteor.subscribe('tolls')
    return {
        tolls: ApiTolls.find({plateNumber: {$in: params.customerArray}}).fetch()
    }
}, Tolls)