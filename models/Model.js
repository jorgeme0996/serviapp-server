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
    slug: String
});

//Create Bootcamp Slug From name
ModelSchema.pre('save', function(next){
    this.slug = slugify(`${this.name}`, {lower: true});
    next();
})

module.exports = mongoose.model("Model", ModelSchema);