require('../config/config');

const express = require('express');
const {verificarToken, verificaAdmin, verficaGod} = require('../middlewares/auth');
const router  = express.Router();
const Openpay = require('openpay');
const openpay = new Openpay(process.env.OPENPAY_ID, process.env.OPENPAY_SECRET_KEY, false);
const User = require('../models/User');

router.get('/openpay/user', verificarToken, (req, res) => {

    User.findById(req.user.user._id)
        .populate('addresses')
        .exec((err, user) => {
            if(err) {
                return res.status(500).json({
                    message: 'Error al cargar usuario',
                    err
                })
            } else if(user.openPayId){ 
                openpay.customers.get(user.openPayId, (err, customer) => {
                    return res.status(200).json({
                        ok: true,
                        customer
                    })
                })
            } else {
                const billingAddress = user.addresses.filter(address => address.isBilling);
                const newCustomer = {
                    name: user.name,
                    email: user.email,
                    last_name: user.lastName,
                    address: {
                        city: billingAddress[0].city,
                        state: billingAddress[0].state,
                        line1: `${billingAddress[0].street} no ${billingAddress[0].numExt} ${billingAddress[0].numInt || ''}`,
                        line2: `col ${billingAddress[0].streetTwo}`,
                        postal_code: billingAddress[0].zipCode,
                        country_code:"MX"
                    },
                    phone_number: user.phone,
                    external_id: user._id
                }

                openpay.customers.create(newCustomer, (err, body) => {
                    if(err) {
                        return res.status(500).json({
                            message: 'Error al crear usuario en Openpay',
                            err
                        })
                    }
                    user.openPayId = body.id;
                    user.save();
                    
                    return res.status(200).json({
                        ok: true,
                        customer: body
                    })
                })
            }
        })
})

router.post('/charge/:idCard', verificarToken, (req, res) => {
    const cardId = req.params.idCard;

    User.findById(req.user.user._id, (err, user) => {

        if(err) {
            return res.status(500).json({
                message: 'Error al cargar usuario',
                err
            })
        } else if(user) {
            openpay.customers.get(user.openPayId, (err, customer) => {
                if(err) {
                    return res.status(500).json({
                        message: 'Error al cargar usuario de Openpay',
                        err
                    })
                } else {
                    const newCharge = {
                        source_id: cardId,
                        method: 'card',
                        amount: req.body.amount,
                        currency: req.body.currency,
                        description: req.body.description,
                        order_id: req.body.order_id,
                        device_session_id: req.body.device_session_id,
                        customer: {
                            name: customer.name,
                            last_name: customer.last_name,
                            phone_number: customer.phone_number,
                            email: customer.email
                        }
                    }
                    openpay.charges.create(newCharge, (err, charge) => {
                        if(err) {
                            return res.status(500).json({
                                message: 'Error al crear cargo',
                                err
                            })
                        }

                        return res.status(200).json({
                            ok: true,
                            charge
                        })
                    })
                }
            })
        } else {
            if(err) {
                return res.status(500).json({
                    message: 'Usuario no encontrado',
                    err
                })
            }
        }
    })

})

module.exports = router;