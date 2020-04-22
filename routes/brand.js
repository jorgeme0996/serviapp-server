const express = require('express');
const Brand = require('../models/Brand');
const {verificarToken, verificaAdmin} = require('../middlewares/auth');
const router  = express.Router();

router.post('/create', [verificarToken, verificaAdmin], (req, res) => {
    Brand.create(req.body, (err, brand) => {
        if(err) {
            return res.status(500).json({
                message: 'Error al crear marca',
                ok: false
            })
        }

        return res.status(200).json({
            brand,
            ok: true
        })
    })
})

router.put('/update/:idBrand', [verificarToken, verificaAdmin], (req, res) => {
    Brand.findByIdAndUpdate(req.params.idBrand, req.body, {new:true}, (err, brand) => {
        if(err) {
            return res.status(500).json({
                message: 'Error al actualizar marca',
                ok: false
            })
        }

        return res.status(200).json({
            brand,
            ok: true
        })
    })
})

router.get('/all', verificarToken, (req, res) => {
    Brand.find()
        .populate('products')
        .populate('models')
        .sort({name:1})
        .exec((err, brands) => {
            if(err) {
                return res.status(500).json({
                    message: 'Error al cargar marcas',
                    ok: false
                })
            }

            return res.status(200).json({
                brands,
                ok: true
            })
        })
})

module.exports = router;