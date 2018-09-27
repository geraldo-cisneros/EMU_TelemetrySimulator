var mongoose = require('mongoose')
const { simulationStep } = require('./simulate')
var SimulationState = mongoose.model('SimulationState')	
var SimulationControl = mongoose.model('SimulationControl')

let simTimer = null
let simStateID = null
let controlID = null 
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
			started_at,
			heart_bpm: 0,
			p_sub: 0,
			t_sub: 0,
			v_fan: 0,
			p_o2: 0,
			rate_o2: 0,
			cap_battery: 0,
			t_battery: 0,
			p_h2o_g: 0,
			p_h2o_l: 0,
			p_sop: 0,
			rate_sop:0 ,
			t_oxygen: 0,
			t_oxygenSec: 0,
			t_water: 0,
		})
		simStateID = state._id 
		const controls = await SimulationControl.create({
			started_at,
			//names are temporary... change when switch functions are decided
			switch1: false,
			switch2: false,
			switch3: false,
			switch4: false,
			switch5: false,
			switch6: false,
			failure_mode: false
		})
		controlID = controls._id
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

module.exports.setControls = async function(newControls){
	const controls = await SimulationControl.findByIdAndUpdate(controlID, newControls, {new: true}).exec()
	return controls 
}

async function step(){
	// const oldSimState = await SimulationState.find({},{_id:0, __v:0}).sort({'create_date':-1}).limit(1).exec()
	// const controls = await SimulationControl.find({},{_id:0, __v:0}).sort({'create_date':-1}).limit(1).exec()
	try{
		const simState = await SimulationState.findById(simStateID).exec()
		const controls = await SimulationControl.findById(controlID).exec()
		const now = Date.now()
		const dt = now - lastTimestamp 
		lastTimestamp = now
		const newSimState = simulationStep(dt, controls, simState)
		// simState.heart_bpm = newSimState.heart_bpm
		Object.assign(simState, newSimState)
		await simState.save()
	}
	catch(error){
		console.error('failed error')
		console.error(error.toString())
	}
}




