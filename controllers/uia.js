
module.exports.simulationStepUIA = function(dt, uiaControls, uiaOldSimState){

	// const cap_battery = batteryStep(dt, controls, oldSimState).cap_battery
	// const t_battery = batteryStep(dt, controls, oldSimState).t_battery
	// const battery_out = batteryStep(dt, controls, oldSimState).battery_out
	const emu_onOff = emuOnOff(dt, uiaControls, uiaOldSimState)
	
	if (uiaControls.emu_on_off === true)
		return {
			emu_onOff,
			o2_supply_pressure: o2SupplyPressure(dt, uiaControls, uiaOldSimState).o2_pressure, 
			oxygen_supp_out: o2SupplyPressure(dt, uiaControls, uiaOldSimState).o2_pressure_out,
			water_supply: supplyWater(dt, uiaControls, uiaOldSimState),
			waste_water: wasteWater(dt, uiaControls, uiaOldSimState),
			oxygen_supply: oxygen(dt, uiaControls, uiaOldSimState),
			o2_vent: o2Vent(dt, uiaControls, uiaOldSimState),
		}
}

// function padValues(n, width, z = '0') {
// 	n = n.toString()
// 	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
// }

function emuOnOff(dt, uiaControls, uiaOldSimState) {
	let onOff = uiaOldSimState.emu_onOff
	if (uiaControls.emu_on_off === true){
		onOff = 'ON'
	}
	else 
		onOff = 'OFF'
	return onOff

}
function o2SupplyPressure(dt, uiaControls, { o2_supply_pressure }) {
	const oxygen_fillRate =  900/ ( 3.5 * 60) //(oz/s)
	const max_o2_psi = 900
	let o2_pressure = o2_supply_pressure
	
	if (o2_pressure < max_o2_psi && uiaControls.oxygen === true && uiaControls.o2_vent === true){
		o2_pressure = o2_pressure + oxygen_fillRate 
	}
	else if (o2_pressure > 0 && oxygen === false)
		o2_pressure -= 10
	else if(o2_pressure <= 0)
		o2_pressure = 0
	else 
		o2_pressure = 900

	const o2_pressure_out = Math.floor(o2_pressure)

	return {o2_pressure, o2_pressure_out}
}

function supplyWater(dt, { supply }, uiaOldSimState) {
	const water_fillRate =  100 / ( 2.5 * 60) //(oz/s)
	const amountFilled = water_fillRate * (dt / 1000)
	let water_supply = uiaOldSimState.water_supply

	if (supply === true && water_supply < 100){
		water_supply = uiaOldSimState.water_supply + amountFilled
	}
	else if(water_supply >= 100)
		water_supply = 100
	else
		water_supply = 0
	
	return water_supply.toFixed(3)
}

function wasteWater(dt, { waste }, uiaOldSimState) {
	let waste_water = uiaOldSimState.waste_water
	if (waste)
		waste_water = 'OPEN'
	else
		waste_water = 'CLOSED'

	return waste_water
}


function oxygen(dt, { oxygen },uiaOldSimState) {
	const oxygen_fillRate =  100 / ( 3 * 60) //(oz/s)
	const amountFilled = oxygen_fillRate * (dt / 1000)
	let oxygen_supply = uiaOldSimState.oxygen_supply

	if (oxygen === true && oxygen_supply < 100){
		oxygen_supply = uiaOldSimState.oxygen_supply + amountFilled
	}
	else if(oxygen_supply >= 100)
		oxygen_supply = 100
	else
		oxygen_supply = 0
	
	return oxygen_supply.toFixed(3)

}

function o2Vent(dt, { o2_vent }, uiaOldSimState) {
	let vent = uiaOldSimState.o2_vent
	if (o2_vent)
		vent = 'VENT'
	
	else
		vent = 'CLOSED'
	return vent
}
