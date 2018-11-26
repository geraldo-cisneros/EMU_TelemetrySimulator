var mongoose = require('mongoose')
var Schema = mongoose.Schema

var SimulationHold = new Schema({
	started_at: { type: Date, required: true },
	handhold: {type: String, required: true}
})
module.exports = mongoose.model('SimulationHold', SimulationHold)
