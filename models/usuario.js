import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const usuario_schema = new Schema({

    email: {type: String, required: [true, 'El nombre es obligatorio'], },
    contraseña: {type: String, required: [true, 'Contraseña requerida']},
    fecha_creacion:{type: Date, default: Date.now},
    estado: {type:Boolean, default:true}
});

const Usuario = mongoose.model('Usuario', usuario_schema);
export default Usuario;