var mongoose = require('mongoose')
var Schema = mongoose.Schema

var SimulationUIASchema = new Schema({
	started_at: { type: Date, required: true },
	emu1:{ type: Boolean, required: true },
	ev1_supply:{ type: Boolean, required: true },
	ev1_waste:{ type: Boolean, required: true },
	emu1_O2:{ type: Boolean, required: true },
	emu2:{ type: Boolean, required: true },
	ev2_supply:{ type: Boolean, required: true },
	ev2_waste:{ type: Boolean, required: true },
	emu2_O2:{ type: Boolean, required: true },
	O2_vent:{ type: Boolean, required: true },
	depress_pump:{ type: Boolean, required: true },

})
module.exports = mongoose.model('SimulationUIA', SimulationUIASchema)