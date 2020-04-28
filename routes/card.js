require('../config/config');

const express = require('express');
const {verificarToken, verificaAdmin, verficaGod} = require('../middlewares/auth');
const router  = express.Router();
const Openpay = require('openpay');
const openpay = new Openpay(process.env.OPENPAY_ID, process.env.OPENPAY_SECRET_KEY, false);
const User = require('../models/User');

router.post('/create', verificarToken, (req, res) => {
    const body = req.body;

    User.findById(req.user.user._id, (err, user) => {
        if(err) {
            return res.status(500).json({
                message: 'Error al cargar usuario',
                err
            })
        }

        if(user) {
            const newCard = {
                card_number: body.card_number,
                holder_name: body.holder_name,
                expiration_year: body.expiration_year,
                expiration_month: body.expiration_month,
                cvv2: body.cvv2
            }
            if(user.openPayId){
                openpay.customers.cards.create(user.openPayId, newCard, (err, card) => {
                    if(err) {
                        return res.status(500).json({
                            message: 'Error al crear tarjeta',
                            err
                        })
                    } else {
                        return res.status(200).json({
                            ok: true,
                            card
                        })
                    }
                })
            } else {
                return res.status(400).json({
                    message: 'Usuario sin registro en open pay',
                    err
                })
            }
        } else {
            return res.status(400).json({
                message: 'Usuario no encontrado',
                err
            })
        }
    })
})

module.exports = router;