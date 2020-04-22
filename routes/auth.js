const express = require('express');
const {verificarToken, verificaAdmin} = require('../middlewares/auth');
const router = express.Router();

router.get('/admin', [verificarToken, verificaAdmin], (req, res) => {
    return res.status(200).json({
        ok: true,
        user: req.user
    })
})

router.get('/', [verificarToken], (req, res) => {
    return res.status(200).json({
        ok: true,
        user: req.user
    })
})

module.exports = router;