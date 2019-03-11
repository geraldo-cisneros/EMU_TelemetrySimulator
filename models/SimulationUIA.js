var mongoose = require('mongoose')
var Schema = mongoose.Schema

var SimulationUIASchema = new Schema({
	started_at: { type: Date, required: true },
<<<<<<< HEAD
	//names are temporary... change when switch functions are decided
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
=======
	emu_on_off:{ type: Boolean, required: true },
	supply:{ type: Boolean, required: true },
	waste:{ type: Boolean, required: true },
	oxygen:{ type: Boolean, required: true },
	o2_vent:{ type: Boolean, required: true },
	switch3:{ type: Boolean, required: true },
>>>>>>> ccb6a201406ab36979596a1df295111a058bf060

})
module.exports = mongoose.model('SimulationUIA', SimulationUIASchema)