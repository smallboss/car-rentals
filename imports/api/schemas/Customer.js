/**
 * Created by watcher on 10/5/16.
 */
const Customer = {
    name: {type: String},
    address: {type: String},
    phone: {type: String},
    birthday: {type: Date},
    email: {type: String},
    role: {type: String},
    scans: {
        type: Object, defaultValue: {
            ID: {type: Number},
            License: {type: String}
        }
    },
    carRequests: {
        type: Object,
        defaultValue: [
            {
                dateCreateRequest: {type: Date},
                dateFrom: {type: Date},
                dateTo: {type: Date},
                requestText: {type: String}
            }
        ]
    },
    rentals: {
        type: Object,
        defaultValue: [
            {
                carId: {type: Number},
                dateFrom: {type: Date},
                dateTo: {type: Date}
            }
        ]
    },
    payments: {
        type: Object,
        defaultValue: []
    }
}

export default Customer