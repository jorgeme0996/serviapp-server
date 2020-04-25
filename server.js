require('./config/config');

const express = require('express');
const connectDB = require('./config/db');
const fileupload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const app = express();

//Import Routes
const UserRoutes = require('./routes/user');
const LoginRoutes = require('./routes/login');
const AuthRoutes = require('./routes/auth');
const AddressRoutes = require('./routes/address');
const ShoppingCartRoutes = require('./routes/shoppingCart');
const PaymentRoutes = require('./routes/payment');

//Connect to database
connectDB();

//cors
app.use(cors({origin: true, credentials: true}));

//Body Parser
app.use(express.json());

//File uploading
app.use(fileupload());

//Set static folder
app.use(express.static(path.join(__dirname, '/public')));

//Routes
app.use('/api/v1/user', UserRoutes);
app.use('/api/v1', LoginRoutes);
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/address', AddressRoutes);
app.use('/api/v1/shoppingCart', ShoppingCartRoutes);
app.use('/api/v1/payment', PaymentRoutes);

app.get('/', (req, res)=> {
    res.status(200).json({
        message: 'Welcome to Servicios Integrales API',
        status: 200
    })
})

app.listen(process.env.PORT, ()=>console.log('Server running'));