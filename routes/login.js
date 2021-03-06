const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
    
    let body = req.body;

    User.findOne({email: body.email}, (err, userDB) =>{
        if(err){
            return res.json({
                err
            })
        }

        if(!userDB){
            return res.status(401).json({
                err: {
                    message: 'Usuario o contraseña incorrectos',
                    ok: false
                }
            })
        }

        if(!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(401).json({
                err: {
                    message: 'Usuario o contraseña incorrectos',
                    ok: false
                }
            })
        }

        let token = jwt.sign({
            user: userDB,   
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok: true,
            token,
            user: {
                _id: userDB._id,
                role: userDB.role,
                email: userDB.email,
                name: userDB.name || '',
                lastName: userDB.lastName || '',
                middleName: userDB.middleName,
                shoppingCart: userDB.shoppingCart || ''
            }
        })
    })
})

module.exports = router;