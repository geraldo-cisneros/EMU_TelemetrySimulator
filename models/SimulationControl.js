var mongoose = require('mongoose')
var Schema = mongoose.Schema

var SimulationControlSchema = new Schema({
	started_at: { type: Date, required: true },
	//names are temporary... change when switch functions are decided
	switch1: Boolean,
	switch2: Boolean,
	switch3: Boolean,
	switch4: Boolean,
	switch5: Boolean,
	switch6: Boolean,
	failure: Boolean
})
module.exports = mongoose.model('SimulationControl', SimulationControlSchema)
