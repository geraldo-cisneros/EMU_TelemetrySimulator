var fullTime = 10*60*60*1000
var batterytime = 600*60*1000
var oxygentime = 300*60*1000

module.exports.simulationStep = function(dt, controls, oldSimState){
	// SimulationState.create({
	return {
		heart_bpm: heartBeat(dt, controls, oldSimState),
		p_sub: pressureSUB(dt, controls, oldSimState),
		t_sub: tempSub(dt, controls, oldSimState),
		v_fan: velocFan(dt, controls, oldSimState),
		p_o2: pressureOxygen(dt, controls, oldSimState),
		rate_o2: rateOxygen(dt, controls, oldSimState),
		cap_battery: batteryStep(dt, controls, oldSimState).cap_battery,
		t_battery: batteryStep(dt, controls, oldSimState).t_battery,
		p_h2o_g: pressureWaterGas(dt, controls, oldSimState),
		p_h2o_l: pressureWaterLiquid(dt, controls, oldSimState),
		p_sop: pressureSOP(dt, controls, oldSimState),
		rate_sop: rateSOP(dt, controls, oldSimState),
		t_oxygen: oxygenLife(dt, controls, oldSimState),
		t_oxygenSec: oxygenLifeSec(dt, controls, oldSimState),
		t_water: waterLife(dt, controls, oldSimState),
	}
}

function padValues(n, width, z = '0') {
	n = n.toString()
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}
function secondsToHms(d) {
	d = Number(d)
	var h = Math.floor(d / 3600)
	var m = Math.floor(d % 3600 / 60)
	var s = Math.floor(d % 3600 % 60)

	var time = padValues(h,2) + ':' + padValues(m,2) + ':' + padValues(s,2)
	return time
}
function remaining(d) {
	d = Number(d)
	var m = Math.floor(d % 100000 / 60)
	var m
	return m
}

function batteryStep(dt, { switch1 }, oldSimState){
	// const totalBatteryCapacity = 3000 // Ah
	// const totalBatteryLife_low = 60 * 60 * 3 // s
	// const totalBatteryLife_high = 60 * 60 * 1 // s
	// const drainRate_low = totalBatteryCapacity / totalBatteryLife_low
	// const drainRate_high = totalBatteryCapacity / totalBatteryLife_high
	// const drainRate = controls.switch1 ? drainRate_high : drainRate_low // kA/s
	const drainRate_low = 100 / (3 * 60 * 60) // 3 hours of life (%/s)
	const drainRate_high = 100 / (1.5 * 60 * 60) // 1.5 hours of battery life (%/s)
	const drainRate = switch1 ? drainRate_high : drainRate_low // %/s

	const amountDrained = drainRate * (dt / 1000) // %
	const cap_battery = oldSimState.cap_battery - amountDrained // %
	const t_battery = secondsToHms(cap_battery / drainRate) // s
	return { cap_battery, t_battery }
}

function oxygenLife(t){
	var val
	var elapsed = Date.now() - t
	t_remaining = oxygentime - elapsed
	t_oxygen_prim = remaining(Math.floor(t_remaining/3000))

	if (t_oxygen_prim > 0){
		val = t_oxygen_prim
	}
	else{
		val = 0
	}
	return val
};

function oxygenLifeSec(t){
	oxy = oxygenLife(t)
	var elapsed = Date.now() - t
	t_remaining = oxygentime - elapsed
	t_oxygen_sec = remaining(Math.floor(t_remaining/3000))

	if (oxy == 0){
		return t_oxygen_sec
	}
	else {
		return 100
	}
}
/*     var elapsed = Date.now() - t;
	t_remaining = fullTime - elapsed;
	t_oxygen = secondsToHms(Math.floor(t_remaining/1000)); */

/*     console.log('----------Time calculation Oxygen----------');
	console.log(Math.floor(elapsed/1000) + ' s');
	console.log('This is t_oxygen: ' + t_oxygen) */

function waterLife(t){
	var elapsed = Date.now() - t
	t_remaining = fullTime - elapsed
	t_water = secondsToHms(Math.floor(t_remaining/1000))

/*     console.log('----------Time calculation Water----------');
	console.log(Math.floor(elapsed/1000) + ' s');
	console.log('This is t_water: ' + t_water) */
	return t_water 
};

function heartBeat(){
	max = 90 
	min = 85 
	heart_bpm = Math.random() * (max - min) + min
	return heart_bpm.toFixed(0) 
};

function pressureSUB(){
	max = 7.99 
	min = 7.85 
	p_sub = Math.random() * (max - min) + min
	return p_sub.toFixed(2) 
};

function tempSub(){
	max = 6 
	min = 4 
	t_sub = Math.random() * (max - min) + min
	return t_sub.toFixed(0) 
};


function velocFan(d){
	v_fan = this.v_fan

//if x is true error has been deployed   
	if (d === true){ 
		if (v_fan > 2000){
			v_fan = v_fan - 303 
			return v_fan.toFixed(0)  
		}
		max = 1789 
		min = 879
	} 
	else {
		max = 40000 
		min = 39900 
	}

	v_fan = Math.random() * (max - min) + min
	
	return v_fan.toFixed(0) 
};

function pressureOxygen(){
	const max = 16 
	min = 15 
	p_o2 = Math.random() * (max - min) + min
	return p_o2.toFixed(0) 
};

function rateOxygen(){
	max = 1 
	min = 0.8 
	rate_o2 = Math.random() * (max - min) + min
	return rate_o2.toFixed(1) 
};

function pressureWaterGas(){
	max = 16 
	min = 15 
	p_h2o_g = Math.random() * (max - min) + min
	return p_h2o_g.toFixed(0) 
};

function pressureWaterLiquid(){
	max = 16 
	min = 15 
	p_h2o_l = Math.random() * (max - min) + min
	return p_h2o_l.toFixed(0) 
};

function pressureSOP(){
	max = 950 
	min = 850 
	p_sop = Math.random() * (max - min) + min
	return p_sop.toFixed(0) 
};

function rateSOP(){
	max = 1 
	min = 0.9 
	rate_sop = Math.random() * (max - min) + min
	return rate_sop.toFixed(1) 
};

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
