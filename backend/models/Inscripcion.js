const mongoose = require('mongoose');

const InscripcionSchema = new mongoose.Schema({
  carreraId: { type: String, required: true },
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  genero: { type: String, enum: ['Masculino', 'Femenino', 'Otro'], required: true },
  fechaNacimiento: { type: Date, required: true },
  correo: { type: String, required: true },
  celular: { type: String, required: true },
  pais: { type: String, required: true },
  estado: { type: String, required: true },
  pagoId: { type: String, required: true, unique: true }, // importante para evitar duplicados
}, {
  timestamps: true // agrega createdAt y updatedAt
});

module.exports = mongoose.model('Inscripcion', InscripcionSchema);