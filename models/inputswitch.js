var mongoose = require('mongoose')
var Schema = mongoose.Schema




//Model
var inputSwitchSchema = new Schema({
	create_date: {
		type: Date,
		default: Date.now
	},
	//names are temporary... change when switch functions are decided
	switch1: String,
	switch2: String,
	switch3: String,
	switch4: String,
	switch5: String,
	switch6: String,

})

var inputSwitch = mongoose.model('DCU', inputSwitchSchema)


module.exports.inputSwitch = function(inputData){

	var itemOne = new inputSwitch({
		switch1: inputData.sw1,
		switch2: inputData.sw2,
		switch3: inputData.sw3,
		switch4: inputData.sw4,
		switch5: inputData.sw5,
		switch6: inputData.sw6,
		create_date: new Date()
	}).save(function(err){
		if (err)
			throw (err)
		console.log('successfully saved switches')
		console.log(inputData.sw2)
	})

}
module.exports.getSwitches = async function(){
	// NEW async/await with promises:
	try {
		const results = await inputSwitch
			.find({}, { _id: 0, __v: 0 })
			.sort('-create_date')
			.limit(1)
			.exec()
		return results[0]
	} catch (error) {
		console.error(error)
		return null
	}
}

function sw1(swtich1){
	if (switch1 === 'true'){
		console.log ('true')
		swt1 = true
	}
	else {
		console.log('false')
		swt1 = false
	}

	return swt1
}

function sw2(inputData){
	console.log(inputData.sw2)
	if (inputData.sw2 === 'true'){
		console.log ('so true')
		swt2 = true
	}
	else {
		console.log('so false')
		swt2 = false
	}

	return swt2
}










