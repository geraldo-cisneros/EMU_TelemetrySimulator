var mongoose = require('mongoose');
var Schema = mongoose.Schema;




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

});

var inputSwitch = mongoose.model('DCU', inputSwitchSchema);


module.exports.inputSwitch = function(inputData){
    var itemOne = inputSwitch({
        
        }).save(function(err){
            if (err) 
                throw (err); 
        console.log("successfully saved switches");
        console.log(inputData.sw2)
       
    });
}









