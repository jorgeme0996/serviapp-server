const express = require('express');
const Brand = require('../models/Brand');
const {verificarToken, verificaAdmin} = require('../middlewares/auth');
const router  = express.Router();
const path = require("path");
const fs = require("fs");

router.post('/create', [verificarToken, verificaAdmin], (req, res) => {
    const body = req.body;
    const file = req.file;

    Brand.create(body, (err, brand) => {
        if(err) {
            console.log(err);
            return res.status(500).json({
                message: 'Error al crear marca',
                ok: false,
                err
            })
        }

        if(file){
            const tempPath = file.path;
            const targetPath = path.join(__dirname, `../public/img/uploads/brand/${brand._id}-${file.originalname}`);

            if(path.extname(req.file.originalname).toLowerCase() === '.png' || path.extname(req.file.originalname).toLowerCase() === '.jpg' ||path.extname(req.file.originalname).toLowerCase() === '.png' || path.extname(req.file.originalname).toLowerCase() === '.jpeg') {
                fs.rename(tempPath, targetPath, err => {
                    if(err) {
                        return res.status(500).json({
                            message: 'Error al subir imagen',
                            ok: false,
                            err
                        })
                    } else {
                        brand.photo = `/img/uploads/brand/${brand._id}-${file.originalname}`;
                        brand.save();
                        return res.status(200).json({
                            brand,
                            ok: true
                        })
                    }
                })
            }
        } else {
            return res.status(200).json({
                brand,
                ok: true
            })
        }
    })
})

router.put('/update/:idBrand', [verificarToken, verificaAdmin], (req, res) => {
    const file = req.file;
    const brand = req.body;

    if(file){
        const tempPath = file.path;
        const targetPath = path.join(__dirname, `../public/img/uploads/brand/${req.params.idBrand}-${file.originalname}`);

        if(path.extname(req.file.originalname).toLowerCase() === '.png' || path.extname(req.file.originalname).toLowerCase() === '.jpg' ||path.extname(req.file.originalname).toLowerCase() === '.png' || path.extname(req.file.originalname).toLowerCase() === '.jpeg') {
            fs.rename(tempPath, targetPath, err => {
                if(err) {
                    return res.status(500).json({
                        message: 'Error al subir imagen',
                        ok: false,
                        err
                    })
                } else {
                    brand.photo = `/img/uploads/brand/${req.params.idBrand}-${file.originalname}`;

                    Brand.findByIdAndUpdate(req.params.idBrand, brand, {new:true}, (err, brand) => {
                        if(err) {
                            return res.status(500).json({
                                message: 'Error al actualizar marca',
                                ok: false,
                                err
                            })
                        }
                
                        return res.status(200).json({
                            brand,
                            ok: true
                        })
                    })
                }
            })
        }
    }
})

router.get('/all', (req, res) => {
    Brand.find()
        .sort({name:1})
        .exec((err, brands) => {
            if(err) {
                return res.status(500).json({
                    message: 'Error al cargar marcas',
                    ok: false,
                    err
                })
            }

            return res.status(200).json({
                brands,
                ok: true
            })
        })
})

router.get('/:id', (req, res) => {
    Brand.findById(req.params.id, (err, brand) => {
        if(err) {
            return res.status(500).json({
                message: 'Error al cargar marcas',
                ok: false,
                err
            })
        }

        return res.status(200).json({
            brand,
            ok: true
        })
    })
})

router.delete('/delete/:id', [verificarToken, verificaAdmin], (req, res) => {
    Brand.findByIdAndDelete(req.params.id, (err, brand) => {
        if(err) {
            return res.status(500).json({
                message: 'Error al cargar marcas',
                ok: false,
                err
            })
        }

        return res.status(200).json({
            brand,
            ok: true
        })
    })
})

module.exports = router;