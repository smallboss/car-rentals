import React from 'react';

export const renderTopFieldsNoEditable = (name, status, plateNumber, profit) => {
    return (
            <div className="topFields">
                    <div className="row">
                        <div className="form-group name">
                            <label htmlFor="carName">Name</label>
                            <input 
                                type="text" 
                                ref={ (ref) => this.inputName = ref } 
                                id="carName" 
                                className="form-control"
                                onChange={(e) => this.onChangeName(e.target.value)}
                                value={ name } 
                                disabled/>
                        </div>

                        <div className="form-group status">
                            <label htmlFor="carStatus">Status</label>
                            <input 
                                type="text" 
                                ref={ (ref) => this.inputStatus = ref } 
                                id="carStatus" 
                                className="form-control"
                                value={ status } 
                                disabled/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group plateNumber">
                            <label htmlFor="carPlateNumber">Plate#</label>
                            <input 
                                type="text" 
                                ref={ (ref) => this.inputPlateNumber = ref } 
                                id="carPlateNumber" 
                                className="form-control" 
                                onChange={(e) => this.onChangePlateNumber(e.target.value)}
                                value={ plateNumber } 
                                disabled/>
                        </div>

                        <div className="form-group profit">
                            <label htmlFor="carprofit">Profit</label>
                            <input 
                                type="text" 
                                ref={ (ref) => this.inputProfit = ref } 
                                id="carProfit"
                                className="form-control" 
                                onChange={(e) => this.onChangeProfit(e.target.value)}
                                value={ profit } 
                                disabled/>
                        </div>
                    </div>
            </div>
    )
}




export const renderTabsNoEditable = (description, notes, totalExpense, totalIncome) => {
    return (
           <div className="row">
              <ul className="nav nav-tabs" role="tablist">
                <li className="active"><a href="#description" aria-controls="home" role="tab" data-toggle="tab">Description</a></li>
                <li><a href="#maintenance" aria-controls="messages" role="tab" data-toggle="tab">Maintenance and expense</a></li>
                <li><a href="#notes" aria-controls="messages" role="tab" data-toggle="tab">Notes</a></li>
                <li><a href="#totalExpense" aria-controls="settings" role="tab" data-toggle="tab">Total Expense</a></li>
                <li><a href="#totalIncome" aria-controls="settings" role="tab" data-toggle="tab">Total income</a></li>
              </ul>
              <div className="tab-content">
                <div role="tabpanel" className="tab-pane active" id="description">
                    <textarea disabled>{ description }</textarea>
                </div>
                <div role="tabpanel" className="tab-pane" id="maintenance">
                    
                </div>
                <div role="tabpanel" className="tab-pane" id="notes">
                    <textarea disabled>{ notes }</textarea>
                </div>
                <div role="tabpanel" className="tab-pane" id="totalExpense">
                    <input type="text" value={ totalExpense }  disabled/>
                </div>
                <div role="tabpanel" className="tab-pane" id="totalIncome">
                    <input type="text" value={ totalIncome } disabled />
                </div>
              </div>
            </div>
    )
}