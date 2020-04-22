const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router  = express.Router();

router.post('/create', function (req, res) {
    let body = req.body;
    let newUser = new User({
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role 
    })

    newUser.save((err, userStored)=>{

        if(err) {
            return res.status(400).json({
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

        res.json({
            ok: true,
            user: userStored,
            token
        })
    })
})

module.exports = router;