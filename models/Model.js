const mongoose = require("mongoose");
const slugify = require("slugify");

var ModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    price: {
        type: Number,
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
    photo: {
        type: String,
        default: 'no-image.png'
    }
});

module.exports = mongoose.model("Model", ModelSchema);