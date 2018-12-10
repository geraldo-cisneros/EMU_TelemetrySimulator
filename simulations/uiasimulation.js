var mongoose = require('mongoose')
const { simulationStepUIA } = require('../telemetry/uia_telemetry')
var SimulationUIA = mongoose.model('SimulationUIA')
var SimulationStateUIA = mongoose.model('SimulationStateUIA')

let simTimer = null
let uiaID= null
let uiaSimStateID = null
let lastTimestamp = null


function isRunning() {
	return uiaSimStateID !== null && uiaID !== null
}

function isPaused() {
	return simTimer == null
}

module.exports.uiaStart = async function(){
	if (isRunning()){
		throw new Error('Simulation is already in progress')
	}
	try{
		const started_at = new Date()
		const uia = await SimulationUIA.create({
			started_at,
			emu_on_off: false,
			supply: false,
			waste: false,
			oxygen: false,
			o2_vent: false,
			switch3: false,
		})
		uiaID = uia._id
		const uiaSimState = await SimulationStateUIA.create({
			started_at,
			emu_onOff: 'OFF',
			o2_supply_pressure: 0,
			water_supply: 0,
			waste_water: 'CLOSED',
			oxygen_supply: 0,
			oxygen_supp_out: 0,
			o2_vent: 'CLOSED',
		})
		uiaSimStateID = uiaSimState._id
		console.log('--------------UIA Simulation Started--------------')
		lastTimestamp = Date.now()
		simTimer = setInterval(uiaStep, 1000)
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
	console.log('--------------UIA Simulation Paused-------------')

	clearInterval(simTimer)
	simTimer = null 
	lastTimestamp = null
}

module.exports.unpause = function(){
	if (!isRunning() || !isPaused()) {
		throw new Error('Cannot unpause: simulation is not running or it is running and is not paused')
	}
	console.log('--------------UIA Simulation Resumed-------------')
	lastTimestamp = Date.now()
	simTimer = setInterval(uiaStep, 1000)
}

//TODO: Do we need a stop? 
module.exports.stop = function(){
	if (!isRunning()) {
		throw new Error('Cannot stop: simulation is not running')
	}
	console.log('-------------- UIA Simulation Stopped-------------')
	uiaSimStateID = null
	uiaID = null 
	clearInterval(simTimer)
	simTimer = null 
	lastTimestamp = null
}

module.exports.getUIAState = async function(){
	const simState = await SimulationStateUIA.findById(uiaSimStateID).exec()
	return simState
}
module.exports.getUIAControls = async function(){
	const controls = await SimulationUIA.findById(uiaID).exec()
	return controls 
}

module.exports.setUIA = async function(newControls){
	const controls = await SimulationUIA.findByIdAndUpdate(uiaID, newControls, {new: true}).exec()
	return controls 
}

async function uiaStep(){
	try{
		const uiaSimState = await SimulationStateUIA.findById(uiaSimStateID).exec()
		const uiaControls = await SimulationUIA.findById(uiaID).exec()
		// const hold = await SimulationHold.findById(holdID).exec()
		const now = Date.now()
		const dt = now - lastTimestamp 
		lastTimestamp = now
		const newSimState = simulationStepUIA(dt, uiaControls, uiaSimState)
		Object.assign(uiaSimState, newSimState)
		await uiaSimState.save()
	}
	catch(error){
		console.error('failed error')
		console.error(error.toString())
	}
}




