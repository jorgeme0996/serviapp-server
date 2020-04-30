const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {verificarToken, verificaAdmin, verificaGod} = require('../middlewares/auth');
const router  = express.Router();

router.post('/create', (req, res) => {
    let body = req.body;
    let newUser = new User({
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        phone: body.phone,
        name: body.name,
        lastName: body.lastName,
        middleName: body.middleName,
        phoneTwo: body.phoneTwo,
        phone: body.phone
    })
    

    newUser.save((err, userStored)=>{

        if(err) {
            return res.status(500).json({
                message: 'Error al crear un usuario',
                err
            })
        }

        let token = jwt.sign({
            user: {
                email: userStored.email,
                role: userStored.role
            },   
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

        res.status (200).json({
            ok: true,
            user: userStored,
            token
        })
    })
})

router.put('/update', verificarToken, (req, res) => {
    const user = req.user.user;
    let body = req.body;
    
    let newUser = {
        email: body.email || user.email,
        role: body.role || user.role,
        phone: body.phone || user.phone,
        name: body.name || user.name,
        lastName: body.lastName || user.lastName,
        middleName: body.middleName || user.middleName,
        phone: body.phone || user.phone,
        phoneTwo: body.phoneTwo || user.phoneTwo
    }

    User.findByIdAndUpdate(user._id, newUser, {new:true}, (err, user) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al actualizar usuario',
                err
            })
        }

        res.status(200).json({
            ok: true,
            user
        })
    })
})

router.patch('/update/password', verificarToken, (req, res) => {
    const user = req.user.user;
    let body = req.body;

    let newPass = {password: bcrypt.hashSync(body.password, 10)};

    User.updateOne({_id: user._id}, newPass, {new:true}, (err, user) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al actualizar contraseña',
                err
            })
        }

        res.status(200).json({
            ok: true,
            user
        })
    })
})

router.delete('/delete/:id', [verificarToken, verificaAdmin], (req, res) => {
    const user = req.params.id;

    User.findByIdAndDelete(user, (err, user) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al actualizar usuario',
                err
            })
        }
        
        if(user){
            res.status(200).json({
                ok: true,
                user
            })
        } else {
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado'
            })
        }
    })
})

module.exports = router;