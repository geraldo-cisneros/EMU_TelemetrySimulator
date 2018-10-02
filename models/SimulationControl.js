var mongoose = require('mongoose')
var Schema = mongoose.Schema

var SimulationControlSchema = new Schema({
	started_at: { type: Date, required: true },
	//names are temporary... change when switch functions are decided
	battery_switch: Boolean,
	O2_switch: Boolean,
	switch3: Boolean,
	switch4: Boolean,
	switch5: Boolean,
	fan_switch: Boolean,
})
module.exports = mongoose.model('SimulationControl', SimulationControlSchema)
