const mongoose = require("mongoose");

var TicketSchema = new mongoose.Schema({
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ItemTicket"
        }
    ],
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        required: true,
        enum: [
            'CONFIRMED',
            'PAYMENT_VALIDATED',
            'SHIPED',
            'DELIVERED'
        ],
        default: 'CONFIRMED'
    },
    iva: {
        type: Number,
        default: 16
    },
    currencyValue: {
        type: Number
    },
    subtotal: {
        type: Number,
        default: 0
    },
    transactionId: String,
    createAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Ticket", TicketSchema);