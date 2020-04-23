const mongoose = require("mongoose");
const slugify = require("slugify");

var BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    models: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Model"
        }
    ],
    slug: String
});

//Create Bootcamp Slug From name
BrandSchema.pre('save', function(next){
    this.slug = slugify(`${this.name}`, {lower: true});
    next();
})

module.exports = mongoose.model("Brand", BrandSchema);