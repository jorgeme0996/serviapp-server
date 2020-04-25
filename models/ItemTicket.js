const mongoose = require("mongoose");

var ItemTicketSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    price: {
        type: Number
    },
    count: {
        type: Number
    }
});

module.exports = mongoose.model("ItemTicket", ItemTicketSchema);