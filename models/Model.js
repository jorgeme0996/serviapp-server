const mongoose = require("mongoose");
const slugify = require("slugify");

var ModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    price: {
        type: String,
        required: [true, 'El precio es obligatorio'],
    },
    description: String,
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    currency: {
        type: String,
        required: [true, 'El tipo de moneda es obligatorio'],
        enum: [
            'MXN',
            'USD'
        ]
    },
    stock: {
        type: String,
        default: '0'
    },
    photo: {
        type: String,
        default: '/img/no-image.png'
    },
    model: String,
    year: String,
    capacity: String,
    series: String,
});

module.exports = mongoose.model("Model", ModelSchema);