const express = require('express');
const Model = require('../models/Model');
const Brand = require('../models/Brand');
const Product = require('../models/Product');
const {verificarToken, verificaAdmin} = require('../middlewares/auth');
const path = require('path');
const fs = require('fs');
const router  = express.Router();

router.post('/create/:idBrand/:idProduct', [verificarToken, verificaAdmin], (req, res) => {
    const body = req.body;
    const file = req.file;
    const params = req.params;

    Product.findById(params.idProduct, (err, product) => {
        if(err) {
            res.status(500).json({
                ok: false,
                message: 'Ocurrio un error al cargar el producto',
                err
            })
        }

        if(product){
            Brand.findById(params.idBrand, (err, brand) => {
                if(err) {
                    res.status(500).json({
                        ok: false,
                        message: 'Ocurrio un error al cargar la marca',
                        err
                    })
                }

                if(brand) {
                    Model.create(body, (err, model) => {

                        if(err) {
                            return res.status(500).json({
                                ok: false,
                                message: 'Ocurrio un error al crear artículo/modelo',
                                err
                            })
                        }
                        
                        model.productId = product._id;
                        model.brandId = brand._id;

                        if(file) {
                            if(file.size < 250000) {
                                const tempPath = file.path;
                                const targetPath = path.join(__dirname, `../public/img/uploads/model/${model._id}-${file.originalname}`);
    
                                if(path.extname(req.file.originalname).toLowerCase() === '.png' || path.extname(req.file.originalname).toLowerCase() === '.jpg' ||path.extname(req.file.originalname).toLowerCase() === '.png' || path.extname(req.file.originalname).toLowerCase() === '.jpeg') {
                                    fs.rename(tempPath, targetPath, err => {
                                        if(err) {
                                            return res.status(500).json({
                                                message: 'Error al subir imagen',
                                                ok: false,
                                            })
                                        } else {
                                            model.photo = `/img/uploads/model/${model._id}-${file.originalname}`;
                                            model.save();
                                            return res.status(200).json({
                                                model,
                                                ok: true
                                            })
                                        }
                                    })
                                } else {
                                    return res.status(400).json({
                                        message: 'El archivo debe ser imagen',
                                        ok: false
                                    })
                                }
                            } else {
                                return res.status(400).json({
                                    message: 'El archivo pesa demasiado',
                                    ok: false,
                                    err
                                })
                            }
                        } else {
                            model.save();
                            return res.status(200).json({
                                model,
                                ok: true
                            })
                        }
                    })

                } else {
                    res.status(400).json({
                        ok: false,
                        message: 'Marca no encontrada'
                    })
                }
            })
        } else {
            res.status(400).json({
                ok: false,
                message: 'Producto no encontrado'
            })
        }
    })
})

router.put('/update/:id/:idBrand/:idProduct', [verificarToken, verificaAdmin], (req, res) => {
    const body = req.body;
    const file = req.file;
    const params = req.params;

    Brand.findById(req.params.idBrand, (err, brand) => {
        if(err) {
            res.status(500).json({
                ok: false,
                message: 'Ocurrio un error al cargar la marca',
                err
            })
        } 

        if(brand){
            Product.findById(req.params.idProduct, (err, product) => {
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Ocurrio un error al cargar la marca',
                        err
                    })
                } 

                if(product) {
                    Model.findById(req.params.id, (err, model) => {
                        if(file) {
                            if(file.size < 250000) {
                                const tempPath = file.path;
                                const targetPath = path.join(__dirname, `../public/img/uploads/model/${model._id}-${file.originalname}`);
    
                                if(path.extname(req.file.originalname).toLowerCase() === '.png' || path.extname(req.file.originalname).toLowerCase() === '.jpg' ||path.extname(req.file.originalname).toLowerCase() === '.png' || path.extname(req.file.originalname).toLowerCase() === '.jpeg') {
                                    fs.rename(tempPath, targetPath, err => {
                                        if(err) {
                                            return res.status(500).json({
                                                message: 'Error al subir imagen',
                                                ok: false,
                                            })
                                        } else {
                                            body.photo = `/img/uploads/model/${model._id}-${file.originalname}`;
                                            Model.findByIdAndUpdate(model._id, body, {new:true}, (err, updatedModel) => {
                                                if(err) {
                                                    return res.status(500).json({
                                                        message: 'Error al actualizar modelo',
                                                        ok: false,
                                                        err
                                                    })
                                                }

                                                return res.status(200).json({
                                                    model: updatedModel,
                                                    ok: true
                                                })
                                            })
                                        }
                                    })
                                } else {
                                    return res.status(400).json({
                                        message: 'El archivo debe ser imagen',
                                        ok: false
                                    })
                                }
                            } else {
                                return res.status(400).json({
                                    message: 'El archivo pesa demasiado',
                                    ok: false,
                                    err
                                })
                            }
                        } else {
                            body.photo = model.photo;
                            Model.findByIdAndUpdate(model._id, body, {new:true}, (err, updatedModel) => {
                                if(err) {
                                    return res.status(500).json({
                                        message: 'Error al actualizar modelo',
                                        ok: false,
                                        err
                                    })
                                }

                                return res.status(200).json({
                                    model: updatedModel,
                                    ok: true
                                })
                            })
                        }
                    })
                } else {
                    return res.status(400).json({
                        ok: false,
                        message: 'Producto no encontrada'
                    })
                }
            })
        } else {
            return res.status(400).json({
                ok: false,
                message: 'Marca no encontrada'
            })
        }
    })
})

router.delete('/delete/:id', [verificarToken, verificaAdmin], (req, res) => {
    Model.findByIdAndDelete(req.params.id, (err, model) => {
        if(err) {
            return res.status(500).json({
                message: 'Error al cargar modelos',
                ok: false,
                err
            })
        }

        return res.status(200).json({
            model,
            ok: true
        })
    })
})

router.get('/all', (req, res) => {
    Model.find()
    .sort({name:1})
    .exec((err, models) => {
        if(err) {
            return res.status(500).json({
                message: 'Error al cargar modelos',
                ok: false,
                err
            })
        }

        return res.status(200).json({
            models,
            ok: true
        })
    })
})

module.exports = router;