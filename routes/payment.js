require('../config/config');

const express = require('express');
const {verificarToken, verificaAdmin, verficaGod} = require('../middlewares/auth');
const router  = express.Router();


module.exports = router;