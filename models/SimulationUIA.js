var mongoose = require('mongoose')
var Schema = mongoose.Schema

var SimulationUIASchema = new Schema({
	started_at: { type: Date, required: true },
	//names are temporary... change when switch functions are decided
	emu_on_off:{ type: Boolean, required: true },
	supply:{ type: Boolean, required: true },
	waste:{ type: Boolean, required: true },
	oxygen:{ type: Boolean, required: true },
	o2_vent:{ type: Boolean, required: true },
	switch3:{ type: Boolean, required: true },

})
module.exports = mongoose.model('SimulationUIA', SimulationUIASchema)