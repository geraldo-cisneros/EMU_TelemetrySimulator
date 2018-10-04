var mongoose = require('mongoose')

var SimulationStateSchema = new mongoose.Schema({
	time: { type: Number, required: true }, 
	started_at: { type: Date, required: true },
	heart_bpm: { type: String, required: true },
	p_sub: { type: String, required: true },
	t_sub: { type: String, required: true },
	v_fan: { type: String, required: true },
	// t_eva: { type: String, required: true },
	p_o2: { type: String, required: true },
	rate_o2: { type: String, required: true },
	cap_battery: { type: Number, required: true },
	p_h2o_g: { type: String, required: true },
	p_h2o_l: { type: String, required: true },
	p_sop: { type: String, required: true },
	rate_sop: { type: String, required: true },
	t_battery: { type: String, required: true },
	t_oxygen: { type: String, required: true },
	t_oxygenSec: { type: String, required: true },
	t_water: { type: Number, required: true },
})

module.exports = mongoose.model('SimulationState', SimulationStateSchema,)
