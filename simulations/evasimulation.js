var mongoose = require('mongoose')
const { simulationStep } = require('../telemetry/eva_telemetry')
var SimulationState = mongoose.model('SimulationState')	
var SimulationControl = mongoose.model('SimulationControl')
var SimulationFailure = mongoose.model('SimulationFailure')

let simTimer = null
let simStateID = null
let controlID = null 
let failureID = null
let holdID = null
let lastTimestamp = null

function isRunning() {
	return simStateID !== null && controlID !== null && failureID !== null && holdID !== null
}

function isPaused() {
	return simTimer == null
}

module.exports.start = async function(){
	if (isRunning()){
		throw new Error('Simulation is already in progress')
	}
	try {
		const started_at = new Date()
		const state = await SimulationState.create({
			time: 0,
			timer: '00:00:00', 
			started_at,
			heart_bpm: 0,
			p_sub: 0,
			t_sub: 0,
			v_fan: 0,
			p_o2: 0,
			rate_o2: 0,
			cap_battery: 100,
			battery_out: 100, 
			t_battery: '00:00:00',
			p_h2o_g: 0,
			p_h2o_l: 0,
			p_sop: 0,
			rate_sop:0 ,
			t_oxygen: 100,
			t_oxygenSec: 100,
			ox_primary: 100,
			ox_secondary: 100, 
			o2_time: '00:00:00',
			cap_water: 100,
			t_water: '00:00:00'
		
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
			fan_switch: false,
		})
		controlID = controls._id
		const failure = await SimulationFailure.create({
			started_at,
			fan_error: false, 
		})
		failureID = failure._id


		console.log('--------------Simulation Started--------------')
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
		throw new Error('Cannot pause: simulation is not running or it is running and is already paused')
	}
	console.log('--------------Simulation Paused-------------')

	clearInterval(simTimer)
	simTimer = null 
	lastTimestamp = null
}

module.exports.unpause = function(){
	if (!isRunning() || !isPaused()) {
		throw new Error('Cannot unpause: simulation is not running or it is running and is not paused')
	}
	console.log('--------------Simulation Resumed-------------')
	lastTimestamp = Date.now()
	simTimer = setInterval(step, 1000)
}

//TODO: Do we need a stop? 
module.exports.stop = function(){
	if (!isRunning()) {
		throw new Error('Cannot stop: simulation is not running')
	}
	console.log('--------------Simulation Stopped-------------')
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

module.exports.setFailure = async function(newFailure){
	const failure = await SimulationFailure.findByIdAndUpdate(failureID, newFailure, {new: true}).exec()
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
		const newSimState = simulationStep(dt, controls, failure, simState)
		Object.assign(simState, newSimState)
		await simState.save()
	}
	catch(error){
		console.error('failed error')
		console.error(error.toString())
	}
}




