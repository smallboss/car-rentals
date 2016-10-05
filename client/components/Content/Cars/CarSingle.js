import React, { Component } from 'react';

export default class CarSingle extends Component {
    render() {
        return(
            <div className="CarSingle">
                this.context.carId

                <div className="row">
                    <div class="form-group name">
                        <label for="carName">Name</label>
                        <input type="text" ref={ (ref) => this.inputName = ref } id="carName" class="form-control" />
                    </div>

                    <div class="form-group status">
                        <label for="carStatus">Status</label>
                        <input type="text" ref={ (ref) => this.inputStatus = ref } id="carStatus" class="form-control" />
                    </div>
                </div>

                <div className="row">
                    <div class="form-group plateNumber">
                        <label for="carPlateNumber">Plate#</label>
                        <input type="text" ref={ (ref) => this.inputPlateNumber = ref } id="carPlateNumber" class="form-control" />
                    </div>

                    <div class="form-group profit">
                        <label for="carprofit">Profit</label>
                        <input type="text" ref={ (ref) => this.inputProfit = ref } id="carProfit" class="form-control" />
                    </div>
                </div>
            </div>
        )
    }
}

CarSingle.contextTypes = {
  carId: React.PropTypes.object
};