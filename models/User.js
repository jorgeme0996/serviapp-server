const mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: [true, 'El correo electrónico ya esta en uso'],
        required: [true, 'El correo electrónico es obligatoria'],
        match: [
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Ingrese un correo electrónico válido'
        ]
    },
    name: String,
    lastName: String,
    middleName: String,
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    phone: {
        type: String,
        maxlength: [10, 'Número a 10 dígitos']
    },
    phoneTwo: {
        type: String,
        maxlength: [10, 'Número a 10 dígitos']
    },
    addresses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address"
        }
    ],
    shoppingCart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShoppingCart"
    },
    tickets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket"
        }
    ],
    role: {
        type: String,
        required: true,
        enum: [
            'GOD_ROLE',
            'ADMIN_ROLE',
            'CLIENT_ROLE'
        ],
        default: 'CLIENT_ROLE'
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    openPayId: String,
    rfc: String
});

UserSchema.methods.toJSON = function (){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

module.exports = mongoose.model("User", UserSchema);