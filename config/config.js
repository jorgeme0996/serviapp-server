//////////////////////////////////////////////
/// Puerto
/////////////////////////////////////////////

process.env.PORT = process.env.PORT || 5000;

//////////////////////////////////////////////
/// Vencimiento token
/////////////////////////////////////////////

process.env.CADUCIDAD_TOKEN = 60*60*24*30;

//////////////////////////////////////////////
/// Vencimiento token
/////////////////////////////////////////////

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//////////////////////////////////////////////
/// MONGO URI
/////////////////////////////////////////////

process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://jorgeme0996:J0rg3007@ds149593.mlab.com:49593/servi-db';

//////////////////////////////////////////////
/// host
/////////////////////////////////////////////

process.env.HOST = process.env.HOST || 'localhost:5000';