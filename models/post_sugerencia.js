import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const post_sugerencia_schema = new Schema({
    titulo: { type: String, required: [true, 'El titulo es requerido']},
    descripcion: { type: String, required: [true, 'La descripción es requerida']},
    fecha_creacion: { type:Date, default: Date.now},
    estado: { type: Boolean, default: true},
    id_usuario: String,
    nombre_usuario: String
});

const Post_sugerencia = mongoose.model('Post_sugerencia', post_sugerencia_schema);
export default Post_sugerencia;