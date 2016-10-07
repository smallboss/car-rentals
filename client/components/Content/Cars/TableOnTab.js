import React, { Component, PropTypes } from 'react';

import CarRow from './CarRow.js';
import HeadList from './HeadList.js';

import { map, debounce } from 'lodash';


export default class TableOnTab extends Component {
    constructor(props, context) {
        super(props, context); 


        this.state = {
            selectedItemsID: []
        }


        this.onAddNew = this.onAddNew.bind(this);
        this.onRemoveItems = this.onRemoveItems.bind(this);
    }   


    onAddNew(){

    }


    onRemoveItems() {

    }

    componentDidMount(){

    }


    render(){


                                // <table className="table table-bordered table-hover">
                                //   <thead>
                                //     <tr>
                                //       <th>Job ID</th>
                                //       <th>Job Name</th>
                                //       <th>Description</th>
                                //       <th>Date</th>
                                //       <th>Status</th>
                                //       <th>Amount</th>
                                //       <th>End Date</th>
                                //     </tr>
                                //   </thead>

                                //   <tbody>
                                //   {
                                //     mainteance.map((item, key) => {
                                //         return (
                                //             <tr key={key}>
                                //               <td><input type="text" velue={item.jobID} /></td>
                                //               <td><input type="text" velue={item.jobName} /></td>
                                //               <td><input type="text" velue={item.escription} /></td>
                                //               <td><input type="text" velue={item.date} /></td>
                                //               <td><input type="text" velue={item.status} /></td>
                                //               <td><input type="text" velue={item.amount} /></td>
                                //               <td><input type="text" velue={item.endDate} /></td>
                                //             </tr>
                                //         )
                                //     })
                                //   }
                                //   </tbody>
                                // </table>


        return (
            <div className="TableOnTab">
                <div className="headListOnTab">

                    <div className="btn-box">
                        <button onClick={this.onAddNew} className='btn btn-primary'>Add New</button>
                        <button 
                            onClick={this.onRemoveItems} 
                            className='btn btn-danger' 
                            ref={(ref) => this.buttonRemove = ref } >
                            Delete
                        </button>
                    </div>

                </div>
            </div>
        )
    }
}