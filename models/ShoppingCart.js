const mongoose = require("mongoose");

var ShoppingCartSchema = new mongoose.Schema({
    itemTickes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ItemTicket"
        }
    ],
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("ShoppingCart", ShoppingCartSchema);