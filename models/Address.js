const mongoose = require("mongoose");
const slugify = require("slugify");

var AddressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: [true, 'La calle es obligatoria'],
    },
    streetTwo: {
        type: String,
        required: [true, 'La colonia es obligatoria'],
    },
    zipCode: {
        type: String,
        required: [true, 'El código postal es obligatorio'],
    },
    city: {
        type: String,
        required: [true, 'La delegación/municipio es obligatorio(a)'],
    },
    state: {
        type: String,
        required: [true, 'El estado es obligatorio'],
    },
    numExt: {
        type: String,
        required: [true, 'El número exterior es obligatorio'],
    },
    numInt: String,
    createAt: {
        type: Date,
        default: Date.now
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isBilling: {
        type: Boolean,
        default: false
    },
    alias: String,
    referenceOne: String,
    referenceTwo: String,
    comments: String
});

module.exports = mongoose.model("Address", AddressSchema);