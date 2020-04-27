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
    photo: {
        type: String,
        default: 'no-image.png'
    }
});

module.exports = mongoose.model("Product", ProductSchema);