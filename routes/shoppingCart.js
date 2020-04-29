const express = require('express');
const ShoppingCart = require('../models/ShoppingCart');
const Model = require('../models/Model');
const User = require('../models/User');
const {verificarToken, verificaAdmin} = require('../middlewares/auth');
const router  = express.Router();

router.get('/create', (req, res) => {
    ShoppingCart.create({}, (err, shoppingCart) => {
        if(err) {
            return res.status(500).json({
                message: 'Error al crear carrito de compras',
                ok: false,
                err
            })
        }

        return res.status(200).json({
            shoppingCart,
            ok: true
        })
    })
})

router.get('/:id', (req, res) => {
    ShoppingCart.findById(req.params.id, (err, shoppingCart) => {
        if(err) {
            return res.status(500).json({
                message: 'Error al cargar carrito de compras',
                ok: false,
                err
            })
        }

        return res.status(200).json({
            shoppingCart,
            ok: true
        })
    })
})

router.patch('/user/:idShoppingCart', verificarToken, (req, res) => {
    const reqUser = req.user.user;

    User.findById(reqUser._id, (err, user) => {
        if(err) {
            return res.status(500).json({
                message: 'Error al cargar usuario',
                ok: false,
                err
            })
        }

        if(user) {
            ShoppingCart.findById(req.params.idShoppingCart, (err, shoppingCart) => {
                if(err) {
                    return res.status(500).json({
                        message: 'Error al cargar carrito de compras',
                        ok: false,
                        err
                    })
                }

                if(shoppingCart) {
                    user.shoppingCart = shoppingCart._id;
                    user.save();
                    shoppingCart.ownerId = user._id;
                    shoppingCart.save();

                    return res.status(200).json({
                        shoppingCart,
                        ok: true
                    })
                }
            })
        } else {
            return res.status(401).json({
                message: 'No se encontro usuario',
                ok: false
            })
        }
    })
})

router.delete('/delete/:id', [verificarToken, verificaAdmin], (req, res) => {
    ShoppingCart.findByIdAndDelete(req.params.id, (err, shoppingCart) => {
        if(err) {
            return res.status(500).json({
                message: 'Error al borrar carrito de compras',
                ok: false,
                err
            })
        }

        return res.status(200).json({
            shoppingCart,
            ok: true
        })
    })
})

module.exports = router;