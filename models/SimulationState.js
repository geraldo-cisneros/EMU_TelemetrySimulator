var mongoose = require('mongoose')

var SimulationStateSchema = new mongoose.Schema({
	
	time: { type: Number, required: true }, 
	timer: { type: String, required: true }, 
	started_at: { type: Date, required: true },
	heart_bpm: { type: Number, required: true },
	p_sub: { type: String, required: true },
	t_sub: { type: String, required: true },
	v_fan: { type: String, required: true },
	p_o2: { type: String, required: true },
	rate_o2: { type: String, required: true },
	cap_battery: { type: Number, required: true },
	battery_out: { type: Number, required: true },
	p_h2o_g: { type: String, required: true },
	p_h2o_l: { type: String, required: true },
	p_sop: { type: String, required: true },
	rate_sop: { type: String, required: true },
	t_battery: { type: String, required: true },
	t_oxygen: { type: String, required: true },
	t_oxygenSec: { type: String, required: true },
	ox_primary: { type: String, required: true },
	ox_secondary: { type: String, required: true },
	o2_time: { type: String, required: true },
	cap_water: { type: Number, required: true },
	t_water: { type: String, required: true },

})

module.exports = mongoose.model('SimulationState', SimulationStateSchema,)
