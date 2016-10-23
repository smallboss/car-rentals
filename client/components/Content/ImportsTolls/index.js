/**
 * Created by watcher on 10/19/16.
 */
import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Mongo } from 'meteor/mongo'
import { ApiTolls } from '/imports/api/tolls'
import '../../../helpers/simple-excel'
import './style.css'


const csvParser = new SimpleExcel.Parser.CSV()
const Toll = function () {
    return {
        _id: new Mongo.ObjectID(),
        description: '',
        fineStatus: '',
        amount: '',
        fineSource: '',
        fineTime: '',
        fineDate: '',
        fineId: '',
        licenseSource: '',
        licenseNumber: '',
        plateSymbol: '',
        plateType: '',
        plateNumber: ''
    }
}

class Tolls extends React.Component {
    constructor (props) {
        super(props)
        this.state = {tolls: props.tolls || [], showModalTolls: 0}        
    }
    componentWillReceiveProps(nextProps) {
        this.setState({tolls: nextProps.tolls})
    }
    importFileHandler (e) {
        e.preventDefault()
        let fileToImport = e.target['fileImport'].files[0]
        csvParser.loadFile(fileToImport, () => {
            let csvResult = csvParser.getSheet()
            for(let i = 1; i < (csvResult.length - 1); i++) {
                //console.log(csvResult[i])
                let toll = new Toll()
                if(csvResult[i].length == 1) {
                    let cutted = csvResult[i][0].value.split(';').filter(item => {return item.length != 0})
                    toll.description = cutted[0]
                    toll.fineStatus = cutted[1]
                    toll.amount = cutted[2]
                    toll.fineSource = cutted[3]
                    toll.fineTime = cutted[4]
                    toll.fineDate = cutted[5]
                    toll.fineId = cutted[6]
                    toll.licenseSource = cutted[7]
                    toll.licenseNumber = cutted[8]
                    toll.plateSymbol = cutted[9]
                    toll.plateType = cutted[10]
                    toll.plateNumber = cutted[11]
                } else if(csvResult[i].length > 1) {
                    toll.description = csvResult[i][0].value
                    toll.fineStatus = csvResult[i][1].value
                    toll.amount = csvResult[i][2].value
                    toll.fineSource = csvResult[i][3].value
                    toll.fineTime = csvResult[i][4].value
                    toll.fineDate = csvResult[i][5].value
                    toll.fineId = csvResult[i][6].value
                    toll.licenseSource = csvResult[i][7].value
                    toll.licenseNumber = csvResult[i][9].value
                    toll.plateSymbol = csvResult[i][11].value
                    toll.plateType = csvResult[i][12].value
                    toll.plateNumber = csvResult[i][13].value
                }
                //console.log(toll)
                ApiTolls.insert(toll)
            }
        })
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
                    <div className='col-xs-10'>
                        <form encType='multipart/form-data' method='post' onSubmit={this.importFileHandler}>
                            <div className='col-xs-8'>
                                <input type='file' className='form-control' name='fileImport'/>
                            </div>
                            <div className='col-xs-4'>
                                <input type='submit' className='btn btn-success' value='Import'/>
                            </div>
                        </form>
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

export default createContainer(() => {
    Meteor.subscribe('tolls')
    return {
        tolls: ApiTolls.find().fetch()
    }
}, Tolls)