const express = require('express');
const User = require('../models/User');
const Address = require('../models/Address');
const {verificarToken} = require('../middlewares/auth');
const router  = express.Router();

router.post('/create', verificarToken, (req, res)=> {
    const userId = req.user.user._id;
    User.findById(userId, (err, user)=> {
        if(err){
            return res.status(500).json({
                message: 'Error al cargar usuario',
                ok: false,
                err
            })
        }

        if(user) {
            Address.create(req.body, (err, address)=> {
                if(err){
                    return res.status(500).json({
                        message: 'Error al crear una dirección',
                        ok: false,
                        err
                    })
                }
    
                address.ownerId = req.user.user._id;
                address.save();
                user.addresses.push(address);
                user.save();
    
                return res.status(200).json({
                    ok: true,
                    address
                })
            })
        } else {
            return res.status(401).json({
                message: 'No se encontro usuario',
                ok: false
            })
        }
    })
})

router.put('/update/:idAddress', verificarToken, (req, res)=> { 
    console.log(req.body);
    const id = req.params.idAddress;
    Address.findById(id, (err, address)=> {
        if(err) {
            return res.status(500).json({
                message: 'Error al actualizar Dirección',
                ok: false,
                err
            })
        }
        if(req.user.user._id.toString() === address.ownerId.toString()) {
            Address.findByIdAndUpdate(id, req.body, {new:true}, (err, address)=> {
                if(err) {
                    return res.status(500).json({
                        message: 'Error al actualizar Dirección',
                        ok: false,
                        err
                    })
                }
        
                return res.status(200).json({
                    address,
                    ok: true
                })
            })
        } else {
            return res.status(401).json({
                message: 'Usuario Incorrecto',
                ok: false
            })
        }
    })
})

router.get('/user', verificarToken, (req, res)=> {
    const user = req.user.user;

    Address.find({ownerId: user._id}, (err, addresses)=> {
        if(err){
            return res.status(500).json({
                message: 'Error al cargar al direcciones',
                ok: false,
                err
            })
        }

        if(addresses) {
            return res.status(200).json({
                addresses,
                ok: true
            })
        }
    })
})

router.get('/:id', verificarToken, (req, res) => {
    Address.findById(req.params.id, (err, address) => {
        if(err) {
            return res.status(500).json({
                message: 'Error al cargar la dirección',
                ok: false,
                err
            })
        }
        if(address) {
            if(req.user.user._id.toString() === address.ownerId.toString()){
                return res.status(200).json({
                    ok: true,
                    address
                })
            } else {
                return res.status(401).json({
                    message: 'Usuario no valido',
                    ok: false
                })
            }
        } else {
            return res.status(400).json({
                message: 'Dirección no encontrada',
                ok: false
            })
        }
    })
})

router.delete('/delete/:idAddress', verificarToken, (req, res) => {
    const idAddress = req.params.idAddress;
    const user = req.user.user;

    Address.findById(idAddress, (err, address) => {
        if(err) {
            return res.status(500).json({
                message: 'Error al borrar dirección',
                ok: false,
                err
            })
        }
        if(address) {
            if(address.ownerId.toString() === user._id.toString()){
                Address.findByIdAndDelete(idAddress, (err, address) => {
                    if(err) {
                        return res.status(500).json({
                            message: 'Error al borrar dirección',
                            ok: false,
                            err
                        })
                    }
    
                    return res.status(200).json({
                        address,
                        ok: true
                    })
                })
            } else {
                return res.status(401).json({
                    message: 'Usuario Incorrecto',
                    ok: false
                })
            }
        } else {
            return res.status(400).json({
                message: 'Dirección no encontrada',
                ok: false
            })
        }
    })
})

module.exports = router;