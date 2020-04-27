require('../config/config');

const express = require('express');
const {verificarToken, verificaAdmin, verficaGod} = require('../middlewares/auth');
const router  = express.Router();

router.post('/create-payment-intent', verificarToken, async(req, res) => {
    const intent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: req.body.currency.toLowerCase(),
        // Verify your integration in this guide by including this parameter
        metadata: {integration_check: 'accept_a_payment'}
    });

    res.json({
        client_secret: intent.client_secret
    })
})

module.exports = router;