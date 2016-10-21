import { ApiInvoices } from '/imports/api/invoices.js'
import { ApiLines } from '/imports/api/lines.js'
import { ApiUsers } from '/imports/api/customers'
import { ApiCars } from '/imports/api/cars'

export const getInvoiceMsg = (invoiceId) => {
    const showPeriod = (dateFrom, dateTo) => {
        let period;
        let Date1, Date2;

        Date1 = new Date (dateFrom);
        Date2 = new Date (dateTo);

        period = Math.floor((Date2.getTime() - Date1.getTime())/(1000*60*60*24));

        return period;
    }

    const invoice = ApiInvoices.findOne({_id: invoiceId});
    const customer = Meteor.users.findOne({_id: invoice.customerId});

    let customerUrl = `${location.host}/managePanel/customer/${invoice.customerId}`;

    let topFields = "<div style='font-size: 16px;'>";
    topFields += `<h2 style='margin-bottom: 40px; text-align: center;'>Invoice ${invoice.codeName} report</h2>`;
    topFields += `<div style='margin: 5px;'><span style='margin-right: 10px; font-weight: bold;'>Customer name:</span><a href="${customerUrl}" target="_blank">${customer.profile.name}</a></div>`;
    topFields += `<div style='margin: 5px;'><span style='margin-right: 10px; font-weight: bold;'>Status:</span>${invoice.status}</div>`;
    topFields += `<div style='margin: 5px;'><span style='margin-right: 10px; font-weight: bold;'>Invoice date:</span>${invoice.date}</div>`;
    topFields += `<div style='margin: 5px;'><span style='margin-right: 10px; font-weight: bold;'>Invoice Due date:</span>${invoice.dueDate}</div>`;

    let totalAmount = 0;

    
    topFields += "<h3>Invoice lines:</h3>";
    topFields += `<table style="border-collapse: collapse; line-height: 33px; width: 100%;">
                    <thead style="border-bottom: 1px solid black;">
                        <tr>
                            <th style='padding: 0 15px;'>Item</th>
                            <th style='padding: 0 15px;'>Description</th>
                            <th style='padding: 0 15px;'>Car plate#</th>
                            <th style='padding: 0 15px;'>From</th>
                            <th style='padding: 0 15px;'>To</th>
                            <th style='padding: 0 15px;'>Period</th>
                            <th style='padding: 0 15px;'>Amount</th>
                        </tr>
                    </thead>
                    <tbody>`;

    if (invoice.linesId && invoice.linesId.length) {

        invoice.linesId.map((el) => {
            const line = ApiLines.findOne({_id: el});

            const car = ApiCars.findOne({_id: line.car});
            console.log('car', car);

            let carUrl = car ? `${location.host}/managePanel/car/${car._id}` : '';

            topFields += 
            `<tr>
                <td style='text-align: center;'><a href="${carUrl}" target="_blank">${car ? car.name : ''}</a></td>
                <td style='text-align: center;'>${line.description ? line.description : ''}</td>
                <td style='text-align: center;'><a href="${carUrl}" target="_blank">${car ? car.plateNumber : ''}</a></td>
                <td style='text-align: center;'>${line.dateFrom ? line.dateFrom : ''}</td>
                <td style='text-align: center;'>${line.dateTo ? line.dateTo : ''}</td>
                <td style='text-align: center;'>${isNaN(showPeriod(line.dateFrom, line.dateTo)) ? '' : showPeriod(line.dateFrom, line.dateTo)}</td>
                <td style='text-align: center;'>${line.amount}</td>
             </tr>`

            totalAmount += parseInt(line.amount);
        })
        topFields += 
            `<tr>
                <td></td><td></td><td></td><td></td><td></td>
                <td style='text-align: center;'>Total amount:</td>
                <td style='text-align: center;'>${totalAmount}</td>
            </tr>`;

        topFields += `</tbody>
                    </table>`
    }

    topFields += "</div>";

    return topFields;
}