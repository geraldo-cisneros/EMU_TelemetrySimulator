
module.exports.simulationStep = function(dt, controls, failure, oldSimState){

	const cap_battery = batteryStep(dt, controls, oldSimState).cap_battery
	const t_battery = batteryStep(dt, controls, oldSimState).t_battery
	const battery_out = batteryStep(dt, controls, oldSimState).battery_out

	if (controls.battery_switch) //determines whether the Suit is on/off
	// SimulationState.create({
		return {
		
			time: missionTimer(dt, controls, oldSimState).time,
			timer: missionTimer(dt, controls, oldSimState).timer, 
			heart_bpm: heartBeat(dt, controls, failure, oldSimState),
			p_sub: pressureSUB(dt, controls, oldSimState),
			t_sub: tempSub(dt, controls, oldSimState),
			v_fan: velocFan(dt, controls, failure, oldSimState),
			p_o2: pressureOxygen(dt, controls, oldSimState),
			rate_o2: rateOxygen(dt, controls, oldSimState),
			cap_battery,
			battery_out,
			t_battery,
			p_h2o_g: pressureWaterGas(dt, controls, oldSimState),
			p_h2o_l: pressureWaterLiquid(dt, controls, oldSimState),
			p_sop: pressureSOP(dt, controls, oldSimState),
			rate_sop: rateSOP(dt, controls, oldSimState),
			t_oxygen: oxygenLife(dt, controls, oldSimState).t_oxygenPrimary,
			t_oxygenSec: oxygenLife(dt, controls, oldSimState).t_oxygenSecondary,
			ox_primary: oxygenLife(dt, controls, oldSimState).oxPrimar_out,
			ox_secondary: oxygenLife(dt, controls, oldSimState).oxSecondary_out,
			o2_time:oxygenLife(dt, controls, oldSimState).o2_time,
			cap_water: waterLife(dt, controls, oldSimState).cap_water,
			t_water: waterLife(dt, controls, oldSimState).t_water
	
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

function missionTimer(dt , controls, oldSimState){
	const time = oldSimState.time + (dt/1000)
	const timer = secondsToHms(time)
	return {timer, time}
}

function batteryStep(dt, { battery_switch }, oldSimState){
	const drainRate = 100 / (4 * 60 * 60) // 4 hours of life (%/s)
	let cap_battery = oldSimState.cap_battery
	const amountDrained = drainRate * (dt / 1000) // %
	const t_battery = secondsToHms(cap_battery / drainRate) // s
	const battery_out = Math.floor(cap_battery)
	if (battery_switch){
		cap_battery = cap_battery - amountDrained// %
	}
	return { cap_battery , t_battery, battery_out}
}

function oxygenLife(dt, { O2_switch }, oldSimState){

	const ox_drainRate= 100 / ( 3 * 60 * 60) // 3 hours of life (%/s)
	const amountDrained = ox_drainRate * ( dt / 1000)// %
	let t_oxygenPrimary = oldSimState.t_oxygen
	let t_oxygenSecondary = oldSimState.t_oxygenSec

	if (O2_switch){
		t_oxygenPrimary = ( t_oxygenPrimary - amountDrained ) // %
	}
	else
		t_oxygenSecondary = (t_oxygenSecondary - amountDrained)

	if (O2_switch && t_oxygenPrimary <= 0){
		t_oxygenPrimary = 0
		t_oxygenSecondary = ( t_oxygenSecondary - amountDrained ) // %
	}
	if (t_oxygenSecondary <= 0){
		t_oxygenSecondary = 0
	}

	const o2_time = secondsToHms ((t_oxygenPrimary / ox_drainRate) + (t_oxygenSecondary / ox_drainRate))
	const oxPrimar_out = Math.floor(t_oxygenPrimary)
	const oxSecondary_out = Math.floor(t_oxygenSecondary)

	return {
		t_oxygenPrimary, t_oxygenSecondary, oxPrimar_out, 
		oxSecondary_out, o2_time, 
	}
}

function waterLife(dt, controls, oldSimState){
	const drainRate = 100 / (5.5 * 60 * 60) // 5.5 hours of life (%/s)
	let cap_water = oldSimState.cap_water
	const amountDrained = drainRate * (dt / 1000) // %
	const t_water = secondsToHms(cap_water / drainRate) // s
	cap_water = cap_water - amountDrained// %

	return { cap_water, t_water, }

}

function heartBeat(dt, controls, {fan_error}, oldSimState){
	let hr_max = 0
	let hr_min = 0
	if (fan_error === true ){
		hr_max = oldSimState.heart_bpm + 2
		hr_min = oldSimState.heart_bpm
		if (hr_max === 120){
			hr_max = 120 
			hr_min = 114
		}
	}
	else {
		hr_max = 93
		hr_min = 85
	}
	const heart_bpm = Math.random() * (hr_max - hr_min) + hr_min
	let hr_mean = (oldSimState.heart_bpm + heart_bpm) / 2
	const avg_hr = (heart_bpm + hr_max + hr_mean + hr_min) / 4
	return avg_hr.toFixed(0) 
}

function pressureSUB(){
	
	const p_sub_max = 4 
	const p_sub_min = 3.85 
	let p_sub = Math.random() * (p_sub_max - p_sub_min) + p_sub_min
	return p_sub.toFixed(2) 
}

function tempSub(){
	const t_sub_max = 32
	const t_sub_min = 31.5 
	let t_sub = Math.random() * (t_sub_max - t_sub_min) + t_sub_min
	let t_sub_avg = (t_sub_max + t_sub_min + t_sub)/3 
	return t_sub_avg.toFixed(1) 
}

function velocFan(dt, { fan_switch }, { fan_error }, oldSimState){
	let v_fan = oldSimState.v_fan
	let fan_max = 0
	let fan_min = 0
	if (fan_error === true && fan_switch === true) { 
		if (v_fan > 2000){
			v_fan = v_fan - 1039 
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
	return (v_fan/1000).toFixed(2)
}

function pressureOxygen(){
	const oxPressure_max = 780 
	const oxPressure_min = 770 
	const p_o2 = Math.random() * (oxPressure_max - oxPressure_min) + oxPressure_min
	let p_o2_avg = (p_o2 + oxPressure_max + oxPressure_min ) / 3

	return p_o2_avg.toFixed(2) 
}

function rateOxygen(){
	const oxRate_max = 1 
	const oxRate_min = 0.5 
	const rate_o2 = Math.random() * (oxRate_max - oxRate_min) + oxRate_min
	return rate_o2.toFixed(1) 
}

function pressureWaterGas(){
	const gasPressure_max = 16 
	const gasPressure_min = 14 
	const p_h2o_g = Math.random() * (gasPressure_max - gasPressure_min) + gasPressure_min
	return p_h2o_g.toFixed(2) 
}

function pressureWaterLiquid(){
	const waterPressure_max = 14 
	const waterPressure_min = 16 
	const p_h2o_l = Math.random() * (waterPressure_max - waterPressure_min) + waterPressure_min
	return p_h2o_l.toFixed(2) 
}

function pressureSOP(){
	const sopPressure_max = 850
	const sopPressure_min = 910
	const p_sop = Math.random() * (sopPressure_max - sopPressure_min) + sopPressure_min
	const p_sop_avg = (sopPressure_max + sopPressure_min + p_sop) / 3
	return p_sop_avg.toFixed(0) 
}

function rateSOP(){
	const sopRate_max = 1 
	const sopRate_min = 0.6 
	const rate_sop = Math.random() * (sopRate_max - sopRate_min) + sopRate_min
	return rate_sop.toFixed(1) 
}
