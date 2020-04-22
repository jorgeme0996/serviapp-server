require('./config/config');

const express = require('express');
const connectDB = require('./config/db');
const fileupload = require('express-fileupload');
const path = require('path');

//Import Routes
const UserRoutes = require('./routes/user');
const LoginRoutes = require('./routes/login');
const AuthRoutes = require('./routes/auth');
const AddressRoutes = require('./routes/address');


//Connect to database
connectDB();
const app = express();

//Body Parser
app.use(express.json());

//File uploading
app.use(fileupload());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/api/v1/user', UserRoutes);
app.use('/api/v1', LoginRoutes);
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/address', AddressRoutes);

app.get('/', (req, res)=> {
    res.status(200).json({
        message: 'Welcome to Servicios Integrales API',
        status: 200
    })
})

app.listen(process.env.PORT,process.env.IP || 5000, ()=>console.log('Server running'));