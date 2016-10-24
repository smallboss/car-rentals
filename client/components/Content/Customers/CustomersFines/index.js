/**
 * Created by watcher on 10/19/16.
 */
import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { ApiFines } from '/imports/api/fines'
import './style.css'

class CustomersFines extends React.Component {
    constructor (props, context) {
        super(props)
        this.state = {fines: props.fines || [], showModalFines: 0}        
    }
    componentWillReceiveProps(nextProps) {
        this.setState({fines: nextProps.fines})
    }
    render () {
        let classModal = (this.state.showModalFines) ? 'modal show' : 'modal fade',
            total = +this.state.fines.reduce(function(prev, cur, index, arr) {
                return prev + +cur.amount
            }, 0).toFixed(2)
        return (
            <div>
                <div>
                    <div className='col-xs-2'>
                        <input type='button' className='btn btn-large btn-default' role='button' onClick={() => this.setState({showModalFines: 1})} value='Show Fines' /><br />
                        <span className='m-l-2'>{this.state.fines.length} rows</span>
                    </div>                    
                </div>
                <div id='finesModal' className={classModal}>
                    <div className='overlay'></div>
                    <div className='modal-dialog modal-lg'>
                        <div className='modal-content p-a-1'>
                            <span className='close close-span' onClick={() => {this.setState({showModalFines: 0}); this.forceUpdate()}}>x</span><br />
                            <div className='clearfix'></div>
                            <div className='row p-l-1 text-center'>
                                <div className='col-xs-4 text-left'></div>
                                <div className='col-xs-4 text-center'>
                                    <span className='display-inherit'><h3>Fines</h3></span>
                                </div>
                                <div className='col-xs-4'></div>
                            </div>
                            <table className='table table-hover table-bordered m-y-1'>
                                <thead>
                                <tr>
                                    <th className=''>Trxn</th>
                                    <th className=''>Time</th>
                                    <th className=''>Post Date</th>
                                    <th className=''>Plate #</th>
                                    <th className=''>Source</th>
                                    <th className=''>Tag #</th>
                                    <th className=''>Location</th>
                                    <th className=''>Direction</th>
                                    <th className='' width='100'>Amount(AED)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.fines.map(elem => {
                                    let { transaction, time, postDate, plate, source, tag, location, direction, amount } = elem
                                    return (
                                        <tr key={Math.random()}>
                                            <td>{transaction}</td>
                                            <td>{time}</td>
                                            <td>{postDate}</td>
                                            <td>{plate}</td>
                                            <td>{source}</td>
                                            <td>{tag}</td>
                                            <td>{location}</td>
                                            <td>{direction}</td>
                                            <td className='text-right'>{amount}</td>
                                        </tr>
                                    )
                                })}
                                <tr>
                                    <td><span className='font-weight-bold'>Total:</span></td>
                                    <td colSpan='7'></td>
                                    <td><span className='pull-right font-weight-bold'>{total}</span></td>
                                </tr>
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
    Meteor.subscribe('fines')
    return {
        fines: ApiFines.find({plate: {$in: params.customerArray}}).fetch()
    }
}, CustomersFines)