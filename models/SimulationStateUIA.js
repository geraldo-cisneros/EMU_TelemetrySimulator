var mongoose = require('mongoose')
var Schema = mongoose.Schema

var SimulationStateUIASchema = new Schema({
	started_at: { type: Date, required: true },
	emu1: { type: String, required: true },
	emu2: { type: String, required: true },
	o2_supply_pressure1: { type: Number, required: true },
	o2_supply_pressure2: { type: Number, required: true },
	ev1_supply: { type: String, required: true },
	ev2_supply: { type: String, required: true },
	ev1_waste: { type: String, required: true },
	ev2_waste: { type: String, required: true },
	emu1_O2: { type: String, required: true },
	emu2_O2: { type: String, required: true },
	oxygen_supp_out1: { type: Number, required: true },
	oxygen_supp_out2: { type: Number, required: true },
	O2_vent: { type: String, required: true },
	depress_pump: { type: String, required: true }

})
module.exports = mongoose.model('SimulationStateUIA', SimulationStateUIASchema)