import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data'
import { ApiInvoices } from '/imports/api/invoices.js'
import { ApiUsers } from '/imports/api/users'
import { ApiContracts } from '/imports/api/contracts'
import { ApiYearWrite } from '/imports/api/yearWrite.js';
import LinesOnTab from './LinesOnTab/LinesOnTab.js';
import HeadSingle from './HeadSingle.js';
import { browserHistory } from 'react-router';
import React, { Component } from 'react';
import { clone, cloneDeep, reverse, concat } from 'lodash';

import { repeatPeriods, repeatNumbs } from '/imports/startup/typesList.js';

export default class InvSettings extends Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.inputGenAuto) this.inputGenAuto.checked = this.props.contract.genAuto;
    }

    componentDidMount() {
        if (this.inputGenAuto) this.inputGenAuto.checked = this.props.contract.genAuto;
    }

    render(){

        const renderRepeatNumb = () => {
            if (this.props.editable) {
              return (
                <div className='form-horizontal col-xs-2'>
                  <select className=' form-control' onChange={(e) => this.props.onChangeRepeatNumb(e.target.value)}>
                    <option className='' value={this.props.contract.repeatNumb}>{this.props.contract.repeatNumb}</option>
                    {
                        repeatNumbs.map((el, key) => {
                            return (
                              <option key={`repetNumb-${key}`} value={el}>{el}</option>
                            )
                        })
                    }
                  </select>
                </div>
              )
            }

            return <div className='col-xs-8'>{this.props.contract.repeatNumb}</div>
        }

        
        const renderRepeatReriod = () => {
            if (this.props.editable) {
              return (
                <div className='form-horizontal col-xs-3'>
                  <select className=' form-control' onChange={(e) => this.props.onChangeRepeatPeriod(e.target.value)}>
                    <option className='' value={this.props.contract.repeatPeriod}>{this.props.contract.repeatPeriod}</option>
                    {
                      repeatPeriods.map((el, key) => {
                        if (el != this.props.contract.repeatPeriod) {
                            return (
                              <option key={`repetPariod-${key}`} value={el}>{el}</option>
                            )
                        }
                        return undefined;
                      })
                    }
                  </select>
                </div>
              )
            }

            return <div className='col-xs-8'>{this.props.contract.repeatPeriod}</div>
        }


        return (
          <div className="invoicingSettings">
            <div className="row">
              <div className="form-group profit col-xs-12">
                
                {
                    // <label htmlFor="generateAuto">Generate recurring invoices automatically</label>
                /*(() => {
                    if (this.props.editable) {
                        return (
                            <input 
                            type="checkbox" ref={(ref) => this.inputGenAuto = ref} 
                            onChange={(e) => this.props.onChangeGenAuto(e.target.checked)} />
                        )
                    }
                    return  <input type="checkbox" ref={(ref) => this.inputGenAuto = ref} disabled/>
                })()*/}
              </div>
              <div className="form-group profit col-xs-12">
              {(() => {
                if (!this.props.contract._id) {
                    return (<div className="col-xs-12">To select the invoice, select the customer and manager and save contract</div>)
                }

                if (this.props.editable) {

                  return (<Link to={`/managePanel/invoices/new${ this.props.contract._id._str }`} 
                                target="_blank">Create invoices</Link>)
                }

                return <div className="col-xs-12">Create invoices</div>
              })()}
              </div>
              <div className="form-group profit col-xs-12">
                <label htmlFor="generateAuto" className="col-xs-2">Repeat every</label>
                { renderRepeatNumb() }    
                { renderRepeatReriod() }
              </div>
              <div className="form-group profit col-xs-12">
                
                {
                    // <label htmlFor="generateAuto">Date of the next invoice</label>
                /*(() => {
                    if (this.props.editable) {
                        <input 
                            type="date" 
                            onChange={(e) => this.onChangeNextInvoice(e.target.value)} 
                            value={this.props.contract.nextInvoice}/>
                    }
                    return  <div>{this.props.contract.nextInvoice}</div>
                })*/}
              </div>
            </div>
          </div>
        )
    }
}
