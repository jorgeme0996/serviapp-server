const mongoose = require("mongoose");
const slugify = require("slugify");

var ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand"
    },
    model: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Model"
    },
    stock: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio']
    },
    currency: {
        type: String,
        required: [true, 'El tipo de moneda es obligatorio'],
        enum: [
            'MXN',
            'USD'
        ]
    },
    slug: String
});

//Create Bootcamp Slug From name
ProductSchema.pre('save', function(next){
    this.slug = slugify(`${this.name} ${this.brand} ${this.model}`, {lower: true});
    next();
})

module.exports = mongoose.model("Product", ProductSchema);