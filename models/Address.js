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
    cp: {
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
        type: Number,
        required: [true, 'El número exterior es obligatorio'],
    },
    numInt: Number,
    createAt: {
        type: Date,
        default: Date.now
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    slug: String
});

//Create Bootcamp Slug From name
AddressSchema.pre('save', function(next){
    this.slug = slugify(`${this.street} ${this.numExt} ${this.streetTwo} ${this.city} ${this.state}`, {lower: true});
    next();
})

module.exports = mongoose.model("Address", AddressSchema);