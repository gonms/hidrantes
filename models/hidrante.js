// Load MongoDB driver
var mongoose = require('mongoose');
 
// Define our location schema
var HidranteSchema = new mongoose.Schema({
  id: Number,
  nombre_via: String,
  ubicacion_via: String,
  utm_x: Number,
  utm_y: Number,
  tipo: String,
  loc: [Number],
  propiedad: String,
  marca: String,
  modelo: String,
  apertura: String,
  salida45: Number,
  salida70: Number,
  salida100: Number,
  presion: Number,
  estado: String
});
HidranteSchema.index({ 'loc': '2d' });
// We bind the Location model to the LocationSchema
module.exports = mongoose.model('Hidrante', HidranteSchema);