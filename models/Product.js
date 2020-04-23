const mongoose = require("mongoose");
const slugify = require("slugify");

var ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    brands: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand"
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
ProductSchema.pre('save', function(next){
    this.slug = slugify(`${this.name}`, {lower: true});
    next();
})

module.exports = mongoose.model("Product", ProductSchema);