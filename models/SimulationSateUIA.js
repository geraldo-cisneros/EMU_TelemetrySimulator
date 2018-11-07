var mongoose = require('mongoose')
var Schema = mongoose.Schema

var SimulationStateUIASchema = new Schema({
	started_at: { type: Date, required: true },
	emu_onOff: { type: String, required: true },
	o2_supply_pressure: { type: Number, required: true },
	water_supply: { type: Number, required: true },
	waste_water: { type: String, required: true },
	oxygen_supply: { type: Number, required: true },
	oxygen_supp_out: { type: Number, required: true },
	o2_vent: { type: String, required: true },

})
module.exports = mongoose.model('SimulationStateUIA', SimulationStateUIASchema)