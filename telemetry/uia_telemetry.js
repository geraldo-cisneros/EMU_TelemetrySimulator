
module.exports.simulationStepUIA = function(dt, uiaControls, uiaOldSimState){

<<<<<<< HEAD:controllers/uia.js
	// const cap_battery = batteryStep(dt, controls, oldSimState).cap_battery
	// const t_battery = batteryStep(dt, controls, oldSimState).t_battery
	// const battery_out = batteryStep(dt, controls, oldSimState).battery_out
	//const emu1 = emuOnOff(dt, uiaControls, uiaOldSimState).onOff1
	//const emu2 = emuOnOff(dt, uiaControls, uiaOldSimState).onOff2
	//if (uiaControls.emu_on_off === true)
		
	return {
			emu1 = emuOnOff(dt, uiaControls, uiaOldSimState).onOff1,
			emu2 = emuOnOff(dt, uiaControls, uiaOldSimState).onOff2,
=======
	const emu_onOff = emuOnOff(dt, uiaControls, uiaOldSimState)
	
	if (uiaControls.emu_on_off === true)
		return {
			emu_onOff,
>>>>>>> ccb6a201406ab36979596a1df295111a058bf060:telemetry/uia_telemetry.js
			o2_supply_pressure: o2SupplyPressure(dt, uiaControls, uiaOldSimState).o2_pressure, 
			oxygen_supp_out: o2SupplyPressure(dt, uiaControls, uiaOldSimState).o2_pressure_out,
			ev1_supply: supplyWater(dt, uiaControls, uiaOldSimState).water_supply1,
			ev2_supply: supplyWater(dt, uiaControls, uiaOldSimState).water_supply2,
			ev1_waste: wasteWater(dt, uiaControls, uiaOldSimState).waste_water1,
			ev2_waste: wasteWater(dt, uiaControls, uiaOldSimState).waste_water2,
			emu1_O2: oxygen(dt, uiaControls, uiaOldSimState).oxygen_supply1,
			emu2_O2: oxygen(dt, uiaControls, uiaOldSimState).oxygen_supply2,
			depress_pump: dPump(dt, uiaControls, uiaOldSimState),
			o2_vent: o2Vent(dt, uiaControls, uiaOldSimState),
		}
}


function emuOnOff(dt, uiaControls, uiaOldSimState) {
	let emu1 = uiaOldSimState.emu1
	let emu2 = uiaOldSimState.emu2
	if (uiaControls.emu1 === true){
		onOff1 = 'ON'
	}
	else 
		onOff1 = 'OFF'
	if (uiaControls.emu1 === true){
		onOff2 = 'ON'
	}
	else 
		onOff2 = 'OFF'
	return {onOff1, onOff2}

}
function o2SupplyPressure(dt, uiaControls, { o2_supply_pressure }) {
	const oxygen_fillRate =  900/ ( 3.5 * 60) //(oz/s)
	const max_o2_psi = 900
	let o2_pressure1 = o2_supply_pressure1
	let o2_pressure2 = o2_supply_pressure2
	
	if (o2_pressure1 < max_o2_psi && uiaControls.emu1 === true && uiaControls.o2_vent === true){
		o2_pressure1 = o2_pressure1 + oxygen_fillRate 
	}
	else if (o2_pressure1 > 0 && uiaControls.emu1_O2 === false)
		o2_pressure1 -= 10
	else if(o2_pressure1 <= 0)
		o2_pressure1 = 0
	else 
		o2_pressure1 = 900



	if (o2_pressure2 < max_o2_psi && uiaControls.emu2 === true && uiaControls.o2_vent === true){
		o2_pressure2 = o2_pressure2 + oxygen_fillRate 
	}
	else if (o2_pressure2 > 0 && uiaControls.emu2_O2 === false)
		o2_pressure2 -= 10
	else if(o2_pressure2 <= 0)
		o2_pressure2 = 0
	else 
		o2_pressure2 = 900

	const o2_pressure_out1 = Math.floor(o2_pressure1)
	const o2_pressure_out2 = Math.floor(o2_pressure2)

	return {o2_pressure1, o2_pressure2, o2_pressure_out1, o2_pressure_out2}
}

function supplyWater(dt, uiaControls, uiaOldSimState) {
	const water_fillRate =  100 / ( 2.5 * 60) //(oz/s)
	const amountFilled = water_fillRate * (dt / 1000)
	let water_supply1 = uiaOldSimState.ev1_supply
	let water_supply2 = uiaOldSimState.ev2_supply
	let supply1 = uiaControls.ev1_supply
	let supply2 = uiaControls.ev2_supply

//EV1 Supply
	if (supply1 === true && water_supply1 < 100){
		water_supply = uiaOldSimState.water_supply + amountFilled
	}
	else if(water_supply1 >= 100)
		water_supply1 = 100
	else
		water_supply1 = 0
	
//EV2 Supply	
	if (supply2 === true && water_supply2 < 100){
			water_supply2 = uiaOldSimState.water_supply + amountFilled
	}
	else if(water_supply2 >= 100)
			water_supply2 = 100
	else
			water_supply2 = 0
	
	
	
	return {water_supply1, water_supply2}
}

function wasteWater(dt, uiaControls, uiaOldSimState) {
	let waste_water1 = uiaOldSimState.ev1_waste
	let waste_water2 = uiaOldSimState.ev2_waste
	let waste1 = uiaControls.ev1_waste
	let waste2 = uiaControls.ev2_waste

//EV1 Waste
	if (waste1)
		waste_water1 = 'OPEN'
	else
		waste_water1 = 'CLOSED'
//EV2 Waste	
	if (waste2)
		waste_water2 = 'OPEN'
	else
		waste_water2 = 'CLOSED'
	
	return {waste_water1,waste_water2}
}


function oxygen(dt, uiaControls,uiaOldSimState) {
	const oxygen_fillRate =  100 / ( 3 * 60) //(oz/s)
	const amountFilled = oxygen_fillRate * (dt / 1000)
	let oxygen_supply1 = uiaOldSimState.emu1_O2
	let oxygen_supply2 = uiaOldSimState.emu2_O2
	let o2_1 = uiaControls.emu1_O2
	let o2_2 = uiaControls.emu2_O2

	if (o2_1 === true && oxygen_supply1 < 100){
		oxygen_supply1 = uiaOldSimState.emu1_O2 + amountFilled
	}
	else if(oxygen_supply1 >= 100)
		oxygen_supply1 = 100
	else
		oxygen_supply1 = 0

	if (o2_2 === true && oxygen_supply2 < 100){
		oxygen_supply2 = uiaOldSimState.emu2_O2 + amountFilled
	}
	else if(oxygen_supply2 >= 100)
		oxygen_supply2 = 100
	else
		oxygen_supply2 = 0
	
	return {oxygen_supply1, oxygen_supply2}

}
function dPump(dt, { depress_pump }, uiaOldSimState) {
	let pumpState = uiaOldSimState.depress_pump
	if (depress_pump)
		pumpState = 'Enable'
	
	else
		pumpState = 'Fault'
	return pumpState
}

function o2Vent(dt, { O2_vent }, uiaOldSimState) {
	let vent = uiaOldSimState.O2_vent
	if (O2_vent)
		vent = 'VENT'
	
	else
		vent = 'CLOSED'
	return vent
}
