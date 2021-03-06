const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/BuyAppBD'; 
const options = {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true};

const app = express();

//conexion a la BD
mongoose.connect(uri, options).then(
    () => { console.log('Base de datos Conectada!'); },
    err => { err }
  );

//middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));


//rutas

app.use(require('./routes/usuario'));
app.use(require('./routes/login'));
app.use(require('./routes/post_sugerencia'));

//middleware para vue.js del modo history
const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

//servidor
app.set('puerto', process.env.PORT || 3000);
app.listen(app.get('puerto'),()=>{
    console.log('Escuchando el puerto:',app.get('puerto'))
})