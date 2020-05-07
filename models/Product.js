const mongoose = require("mongoose");
const slugify = require("slugify");

var ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },   
    photo: {
        type: String,
        default: '/img/no-image.png'
    }
});

module.exports = mongoose.model("Product", ProductSchema);