var mongoose = require('mongoose')
const { simulationStep } = require('./simulate')
var SimulationState = mongoose.model('SimulationState')	
var SimulationControl = mongoose.model('SimulationControl')
var SimulationFailure = mongoose.model('SimulationFailure')

let simTimer = null
let simStateID = null
let controlID = null 
let failureID = null
let lastTimestamp = null

function isRunning() {
	return simStateID !== null && controlID !== null
}

function isPaused() {
	return simTimer !== null
}

module.exports.start = async function(){
	if (isRunning()){
		throw new Error('Simulation is already in progress')
	}
	try {
		const started_at = new Date()
		const state = await SimulationState.create({
			time: 10800,
			started_at,
			heart_bpm: 0,
			p_sub: 0,
			t_sub: 0,
			v_fan: 0,
			p_o2: 0,
			rate_o2: 0,
			cap_battery: 100.00,
			t_battery: 3 * 60 * 60,
			p_h2o_g: 0,
			p_h2o_l: 0,
			p_sop: 0,
			rate_sop:0 ,
			t_oxygen: 100,
			t_oxygenSec: 100,
			t_water: 32,//ounces
		})
		simStateID = state._id 
		const controls = await SimulationControl.create({
			//names are temporary... change when switch functions are decided
			started_at,
			battery_switch: false,
			O2_switch: false,
			switch3: false,
			switch4: false,
			switch5: false,
			fan_switch: true,
		})
		controlID = controls._id
		const failure = await SimulationFailure.create({
			started_at,
			fan_error: false, 
		})
		failureID = failure._id

		console.log('--------------Simulation started--------------')
		lastTimestamp = Date.now()
		simTimer = setInterval(step, 1000)
	}
	catch (error){
		console.error('failed to start create controls and state')
		console.error(error.toString())
		throw error 
	}
}

module.exports.pause = function(){
	if (!isRunning() || isPaused()) {
		throw new Error('Cannot pause: simulation is not running or is running but paused')
	}
	console.log('--------------Simulation paused-------------')

	clearInterval(simTimer)
	simTimer = null 
	lastTimestamp = null
}

module.exports.unpause = function(){
	if (!isRunning() || !isPaused()) {
		throw new Error('Cannot unpause: simulation is not running and paused')
	}
	console.log('--------------Simulation unpaused-------------')
	lastTimestamp = Date.now()
	simTimer = setInterval(step, 1000)
}

//TODO: Do we need a stop? 
module.exports.stop = function(){
	if (!isRunning()) {
		throw new Error('Cannot stop: simulation is not running')
	}
	console.log('--------------Simulation stopped-------------')
	simStateID = null
	controlID = null 
	clearInterval(simTimer)
	simTimer = null 
	lastTimestamp = null
}

module.exports.getState = async function(){
	const simState = await SimulationState.findById(simStateID).exec()
	return simState
}
module.exports.getControls = async function(){
	const controls = await SimulationControl.findById(controlID).exec()
	return controls 
}

module.exports.getFailure = async function(){
	const failure = await SimulationFailure.findById(failureID).exec()
	return failure
}

module.exports.setControls = async function(newControls){
	const controls = await SimulationControl.findByIdAndUpdate(controlID, newControls, {new: true}).exec()
	return controls 
}

async function step(){
	try{
		const simState = await SimulationState.findById(simStateID).exec()
		const controls = await SimulationControl.findById(controlID).exec()
		const failure = await SimulationFailure.findById(failureID).exec()
		const now = Date.now()
		const dt = now - lastTimestamp 
		lastTimestamp = now
		console.log(lastTimestamp)
		console.log(dt)
		const newSimState = simulationStep(dt, controls, failure, simState)
		Object.assign(simState, newSimState)
		await simState.save()
	}
	catch(error){
		console.error('failed error')
		console.error(error.toString())
	}
}




