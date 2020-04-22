const express = require('express');
const User = require('../models/User');
const Address = require('../models/Address');
const {verificarToken} = require('../middlewares/auth');
const router  = express.Router();

router.post('/create', verificarToken, (req, res)=> {
    const userId = req.user.user._id;
    User.findById(userId, (err, user)=> {
        if(err){
            return res.status(400).json({
                message: 'Error al cargar usuario',
                ok: false
            })
        }

        if(user) {
            Address.create(req.body, (err, address)=> {
                if(err){
                    console.log(err);
                    return res.status(400).json({
                        message: 'Error al crear una dirección',
                        ok: false
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
            return res.status(400).json({
                message: 'No se encontro usuario',
                ok: false
            })
        }
    })
})

router.put('/update/:idAddress', verificarToken, (req, res)=> { 
    const id = req.params.idAddress;
    Address.findById(id, (err, address)=> {
        if(err) {
            return res.status(400).json({
                message: 'Error al actualizar Dirección',
                ok: false
            })
        }
        if(req.user.user._id.toString() === address.ownerId.toString()) {
            Address.findByIdAndUpdate(id, req.body, {new:true}, (err, address)=> {
                if(err) {
                    return res.status(400).json({
                        message: 'Error al actualizar Dirección',
                        ok: false
                    })
                }
        
                return res.status(200).json({
                    address,
                    ok: true
                })
            })
        } else {
            return res.status(400).json({
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
            return res.status(400).json({
                message: 'Error al cargar al direcciones',
                ok: false
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

router.delete('/delete/:idAddress', verificarToken, (req, res) => {
    const idAddress = req.params.idAddress;
    const user = req.user.user;

    Address.findById(idAddress, (err, address) => {
        if(err) {
            return res.status(500).json({
                message: 'Error al borrar dirección',
                ok: false
            })
        }

        if(address.ownerId.toString() === user._id.toString()){
            Address.findByIdAndDelete(idAddress, (err, address) => {
                if(err) {
                    return res.status(500).json({
                        message: 'Error al borrar dirección',
                        ok: false
                    })
                }

                return res.status(200).json({
                    address,
                    ok: true
                })
            })
        } else {
            return res.status(400).json({
                message: 'Usuario Incorrecto',
                ok: false
            })
        }
    })
})

module.exports = router;