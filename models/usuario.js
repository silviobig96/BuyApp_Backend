import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const roles = {
    values: ['ADMIN','USER'],
    message: '{VALUE} Rol no valido'
}

const usuario_schema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es requerido']},
    nombre_usuario: {
        type: String,
        required: [true, 'El Nombre de usuario es requerido'],
        unique:true
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique:true
        },
    contraseña: {type: String, required: [true, 'Contraseña requerida']},
    fecha_creacion:{type: Date, default: Date.now},
    role: {type: String, default: 'USER', enum: roles},
    estado: {type:Boolean, default:true}
});

usuario_schema.plugin(uniqueValidator, { message: 'Error, esperaba {PATH} único.' });

//proceso de ocultacion de contraseña
usuario_schema.methods.toJSON = function(){
    const obj = this.toObject();
    delete obj.contraseña;
    return obj;
}

const Usuario = mongoose.model('Usuario', usuario_schema);
export default Usuario;