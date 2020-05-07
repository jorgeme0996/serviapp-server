const express = require('express');
const Product = require('../models/Product');
const {verificarToken, verificaAdmin} = require('../middlewares/auth');
const router  = express.Router();
const path = require("path");
const fs = require("fs");

router.post('/create', [verificarToken, verificaAdmin], (req, res) => {
    const body = req.body;
    const file = req.file;

    Product.create(body, (err, product) => {
        if(err) {
            console.log(err);
            return res.status(500).json({
                message: 'Error al crear producto',
                ok: false,
                err
            })
        }

        if(file){
            if(file.size < 250000) {
                const tempPath = file.path;
                const targetPath = path.join(__dirname, `../public/img/uploads/product/${product._id}-${file.originalname}`);
    
                if(path.extname(req.file.originalname).toLowerCase() === '.png' || path.extname(req.file.originalname).toLowerCase() === '.jpg' ||path.extname(req.file.originalname).toLowerCase() === '.png' || path.extname(req.file.originalname).toLowerCase() === '.jpeg') {
                    fs.rename(tempPath, targetPath, err => {
                        if(err) {
                            return res.status(500).json({
                                message: 'Error al subir imagen',
                                ok: false,
                            })
                        } else {
                            product.photo = `/img/uploads/product/${product._id}-${file.originalname}`;
                            product.save();
                            return res.status(200).json({
                                product,
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
            return res.status(200).json({
                product,
                ok: true
            })
        }
    })
})

router.put('/update/:idProduct', [verificarToken, verificaAdmin], (req, res) => {
    const file = req.file;
    const product = req.body;

    if(file){
        const tempPath = file.path;
        const targetPath = path.join(__dirname, `../public/img/uploads/product/${req.params.idProduct}-${file.originalname}`);

        if(path.extname(req.file.originalname).toLowerCase() === '.png' || path.extname(req.file.originalname).toLowerCase() === '.jpg' ||path.extname(req.file.originalname).toLowerCase() === '.png' || path.extname(req.file.originalname).toLowerCase() === '.jpeg') {
            fs.rename(tempPath, targetPath, err => {
                if(err) {
                    return res.status(500).json({
                        message: 'Error al subir imagen',
                        ok: false,
                        err
                    })
                } else {
                    product.photo = `/img/uploads/product/${req.params.idProduct}-${file.originalname}`;

                    Product.findByIdAndUpdate(req.params.idProduct, product, {new:true}, (err, prod) => {
                        if(err) {
                            return res.status(500).json({
                                message: 'Error al actualizar producto',
                                ok: false,
                                err
                            })
                        }
                
                        return res.status(200).json({
                            prod,
                            ok: true
                        })
                    })
                }
            })
        }
    } else {
        Product.findById(req.params.idProduct, (err, resProd) => {
            if(err) {
                return res.status(500).json({
                    message: 'Error al actualizar producto',
                    ok: false,
                    err
                })
            }

            if(resProd){
                const updateProd = {
                    name: product.name,
                    photo: resProd.photo
                }

                Product.findByIdAndUpdate(req.params.idProduct, updateProd, {new:true}, (err, newProd) => {
                    if(err) {
                        return res.status(500).json({
                            message: 'Error al actualizar producto',
                            ok: false,
                            err
                        })
                    }

                    return res.status(200).json({
                        product: newProd,
                        ok: true
                    })

                })
            }

        })
    }
})

router.get('/all', (req, res) => {
    Product.find()
        .sort({name:1})
        .exec((err, products) => {
            if(err) {
                return res.status(500).json({
                    message: 'Error al cargar productos',
                    ok: false,
                    err
                })
            }

            return res.status(200).json({
                products,
                ok: true
            })
        })
})

router.delete('/delete/:id', [verificarToken, verificaAdmin], (req, res) => {
    Product.findByIdAndDelete(req.params.id, (err, product) => {
        if(err) {
            return res.status(500).json({
                message: 'Error al cargar producto',
                ok: false,
                err
            })
        }

        return res.status(200).json({
            product,
            ok: true
        })
    })
})

module.exports = router;