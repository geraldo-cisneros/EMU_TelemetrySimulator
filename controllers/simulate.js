
module.exports.simulationStep = function(dt, controls, failure, oldSimState){

	const cap_battery = batteryStep(dt, controls, oldSimState).cap_battery.toFixed(2)
	const t_battery = batteryStep(dt, controls, oldSimState).t_battery

	if (controls.battery_switch)
	// SimulationState.create({
		return {
			heart_bpm: heartBeat(dt, controls, oldSimState),
			p_sub: pressureSUB(dt, controls, oldSimState),
			t_sub: tempSub(dt, controls, oldSimState),
			v_fan: velocFan(dt, controls, failure, oldSimState),
			p_o2: pressureOxygen(dt, controls, oldSimState),
			rate_o2: rateOxygen(dt, controls, oldSimState),
			cap_battery,
			t_battery,
			p_h2o_g: pressureWaterGas(dt, controls, oldSimState),
			p_h2o_l: pressureWaterLiquid(dt, controls, oldSimState),
			p_sop: pressureSOP(dt, controls, oldSimState),
			rate_sop: rateSOP(dt, controls, oldSimState),
			t_oxygen: oxygenLife(dt, controls, oldSimState).t_oxygenPrimary,
			t_oxygenSec: oxygenLife(dt, controls, oldSimState).t_oxygenSecondary,
			t_water: waterLife(dt, controls, oldSimState)
		}
	else{
		return{
			heart_bpm: 0,
			p_sub: 0, 
			t_sub: 0, 
			v_fan: 0, 
			p_o2: 0, 
			rate_o2: 0,
			cap_battery,
			t_battery,
			p_h2o_g: 0,
			p_h2o_l: 0,
			p_sop: 0, 
			rate_sop: 0,
			t_oxygen: oldSimState.t_oxygen, 
			t_oxygenSec: oldSimState.t_oxygenSec, 
			t_water: 0, 

		}
	}
}

function padValues(n, width, z = '0') {
	n = n.toString()
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

function secondsToHms(dt) {
	dt = Number(dt)
	var h = Math.floor(dt / 3600)
	var m = Math.floor(dt % 3600 / 60)
	var s = Math.floor(dt % 3600 % 60)

	var time = padValues(h,2) + ':' + padValues(m,2) + ':' + padValues(s,2)
	return time
}

function batteryStep(dt, { battery_switch }, oldSimState){
	// const totalBatteryCapacity = 3000 // Ah
	// const totalBatteryLife_low = 60 * 60 * 3 // s
	// const totalBatteryLife_high = 60 * 60 * 1 // s
	// const drainRate_low = totalBatteryCapacity / totalBatteryLife_low
	// const drainRate_high = totalBatteryCapacity / totalBatteryLife_high
	// const drainRate = controls.battery_switch ? drainRate_high : drainRate_low // kA/s
	const drainRate = 100 / (4 * 60 * 60) // 4 hours of life (%/s)
	//const drainRate_high = 100 / (2 * 60 * 60) // 2 hours of battery life (%/s)
	//const drainRate = battery_switch ? drainRate_high : drainRate_low // %/s
	let cap_battery = oldSimState.cap_battery
	const amountDrained = drainRate * (dt / 1000) // %
	const t_battery = secondsToHms(cap_battery / drainRate) // s
	if (battery_switch){
		cap_battery = cap_battery - amountDrained// %
	}
	console.log(t_battery)
	return { cap_battery , t_battery }
}

function oxygenLife(dt, { O2_switch }, oldSimState){
	// const totalBatteryCapacity = 3000 // Ah
	// const totalBatteryLife_low = 60 * 60 * 3 // s
	// const totalBatteryLife_high = 60 * 60 * 1 // s
	// const drainRate_low = totalBatteryCapacity / totalBatteryLife_low
	// const drainRate_high = totalBatteryCapacity / totalBatteryLife_high
	// const drainRate = controls.switch1 ? drainRate_high : drainRate_low // kA/s
	const ox_drainRate= 100 / ( 3 * 60 * 60) // 3 hours of life (%/s)
	const amountDrained = ox_drainRate * ( dt / 1000)// %
	let t_oxygenPrimary = oldSimState.t_oxygen
	let t_oxygenSecondary = oldSimState.t_oxygenSec

	if (O2_switch){
		t_oxygenPrimary = ( t_oxygenPrimary - amountDrained ).toFixed(2) // %
	}
	else{
		t_oxygenSecondary = ( t_oxygenSecondary - amountDrained ).toFixed(2) // %
	}
	return {t_oxygenPrimary, t_oxygenSecondary}
}

function waterLife(dt, controls, oldSimState){
	const water_drainRate =  100 / ( 3 * 60 * 60) //(oz/s)
	const amountDrained = water_drainRate * (dt / 1000)
	let t_water = oldSimState.t_water - amountDrained
	// console.log( oldSimState.t_water - amountDrained)
	// console.log(amountDrained)
	// console.log(t_water)
	
	return t_water.toFixed(2)
}

function heartBeat(){
	const hr_max = 90 
	const hr_min = 85 
	let heart_bpm = Math.random() * (hr_max - hr_min) + hr_min
	return heart_bpm.toFixed(0) 
}

function pressureSUB(){
	const p_sub_max = 7.99 
	const p_sub_min = 7.85 
	let p_sub = Math.random() * (p_sub_max - p_sub_min) + p_sub_min
	return p_sub.toFixed(2) 
}

function tempSub(){
	const t_sub_max = 6 
	const t_sub_min = 4 
	let t_sub = Math.random() * (t_sub_max - t_sub_min) + t_sub_min
	return t_sub.toFixed(0) 
}

function velocFan(dt, { fan_switch }, { fan_error }, oldSimState){
	let v_fan = oldSimState.v_fan
	let fan_max = 0
	let fan_min = 0
	if (fan_error === true && fan_switch === true) { 
		if (v_fan > 2000){
			v_fan = v_fan - 303 
			return v_fan.toFixed(0)  
		}
		fan_max = 1789 
		fan_min = 879
	} 
	else if(fan_error === false && fan_switch === true) {
		fan_max = 40000 
		fan_min = 39900 
	}
	else if (fan_switch === false ){
		v_fan = 0
	}
	v_fan = Math.random() * (fan_max - fan_min) + fan_min
	return v_fan.toFixed(0)
}

function pressureOxygen(){
	const oxPressure_max = 16 
	const oxPressure_min = 15 
	const p_o2 = Math.random() * (oxPressure_max- oxPressure_min) + oxPressure_min
	return p_o2.toFixed(0) 
}

function rateOxygen(){
	const oxRate_max = 1 
	const oxRate_min = 0.8 
	const rate_o2 = Math.random() * (oxRate_max - oxRate_min) + oxRate_min
	return rate_o2.toFixed(1) 
}

function pressureWaterGas(){
	const gasPressure_max = 16 
	const gasPressure_min = 15 
	const p_h2o_g = Math.random() * (gasPressure_max - gasPressure_min) + gasPressure_min
	return p_h2o_g.toFixed(0) 
}

function pressureWaterLiquid(){
	const waterPressure_max = 16 
	const waterPressure_min = 15 
	const p_h2o_l = Math.random() * (waterPressure_max - waterPressure_min) + waterPressure_min
	return p_h2o_l.toFixed(0) 
}

function pressureSOP(){
	const sopPressure_max = 950 
	const sopPressure_min = 850 
	const p_sop = Math.random() * (sopPressure_max - sopPressure_min) + sopPressure_min
	return p_sop.toFixed(0) 
}

function rateSOP(){
	const sopRate_max = 1 
	const sopRate_min = 0.9 
	const rate_sop = Math.random() * (sopRate_max - sopRate_min) + sopRate_min
	return rate_sop.toFixed(1) 
}

// /* module.exports.getSuitTelemetry = function(callback, data){
// 	SuitData.find({}, function(err, data){
// 		if (err) throw err; 
// 		callback(data);
// 	})
// }; */

// //Function to return all data from the database
// module.exports.getSuitTelemetry = function (callback, limit) {
// 	SuitData.find({},{_id:0, __v:0},callback)
// }

// //Function to return the most recently created dataset
// module.exports.getSuitTelemetryByDate = function (callback, limit) {
// 	SuitData.find({},{_id:0, __v:0},callback).sort({'create_date':-1}).limit(1)
// }
