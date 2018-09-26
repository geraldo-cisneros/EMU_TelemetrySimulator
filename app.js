var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var interval;
var interval_switch;
var urlencodeParser = bodyParser.urlencoded({extended: false});
var decider = false;
var time = Date.now();

/* var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
//var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var LED = new Gpio(4, 'out'); //use GPIO pin 4 as output
var pushButton = new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled
 */ 
//Import 
Simulation = require('./models/simulate');
Simulate = require('./models/simulation')
SuitSwitch = require('./models/suitswitch');
InputSwitch = require('./models/inputswitch');

//Database connector
mongoose.connect('mongodb://localhost/spacesuit');

//EJS framework for website display
app.use(bodyParser.json());
app.use((req,res,next) =>{
    res.setHeader(
        "Access-Control-Allow-Origin", "*"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-Width, Content-Type, Accept"
);
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
})

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

//ROUTES
app.get('/',function(req, res){
    res.render('index');
});

//On start button, simulation starts
app.post('/', urlencodeParser, function(req, res){
    console.log("--------------Simulation started--------------")
    var time = Date.now(); 
    interval = setInterval(Simulation.suitTelemetry.bind(decider, time),1000);
    interval_switch = setInterval(SuitSwitch.SuitSwitch,1000);
    res.render('contact',{qs: ""});
});

//Returns all simulated data from the database
app.get('/api/suit', function(req, res){      
        Simulation.getSuitTelemetry(function (err, data) {
            if (err) {
                throw err;
                console.log(err);
            }
            res.json(data);
        });
});

app.get('/api/suit/recent', function(req, res){      
    Simulation.getSuitTelemetryByDate(function (err, data) {
        if (err) {
            throw err;
            console.log(err);
        }
        res.json(data);
    });
});

app.get('/api/suitswitch', function(req, res){      
    SuitSwitch.getSuitSwitch(function (err, data) {
        if (err) {
            throw err;
            console.log(err);
        }
        res.json(data);
    });
});

app.get('/api/suitswitch/recent', function(req, res){      
    SuitSwitch.getSuitSwitchByDate(function (err, data) {
        if (err) {
            throw err;
            console.log(err);
        }
        res.json(data);
    });
});

app.get('/contact',function(req, res){
    res.render('contact',{qs: req.query});
});

//Server is stopped
app.post('/contact', urlencodeParser, function(req, res){
    
    
    //console.log(req.body);
    console.log('--------------Simulation stopped--------------');
    clearInterval(interval);
    clearInterval(interval_switch);
    res.render('contact-success',{data: req.body});
});

//Deploy Error
app.post('/error-ready',urlencodeParser, function(req, res){
    console.log('-> Error calculation active!');

    //Stop standard simulation
    clearInterval(interval);
    clearInterval(interval_switch);

    decider = true; 

    //Start alternative simulation
    interval = setInterval(Simulation.suitTelemetry.bind(null, time, decider),1000);
    interval_switch = setInterval(SuitSwitch.SuitSwitch.bind(null,time,decider),1000);

    res.render('error_resolver',{qs: req.query});
})

app.get('/error-ready',function(req, res){
    res.render('error_ready',{qs: req.query});
});

//********************************************************Raspberry Pi Commands*************************************************************
// receive command from pi pass that argument to tha suit telemetry 
app.get('/save', function(req,res){


    var switchInput = { 
         sw1: 'true',
         sw2: req.query.switch2,
         sw3: req.query.switch3,
         sw4: req.query.switch4,
         sw5: req.query.switch5,
         sw6: req.query.switch6,
     }
 
     InputSwitch.inputSwitch(switchInput);
     //InputSwitch.inputSwitch(switchInput);
     
     console.log(switchInput);
     res.send(switchInput); 
     return switchInput;
 });










/* app.get('/profile/:name', function(req, res){
    var data = {age:29, job: 'Astronaut', hobbies: ['eating', 'fighting', 'fishing']};
    res.render('profile', {person: req.params.name, data:data});
}) */


// LED STUFF
/* function handler (req, res) { //create server
  fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    } 
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
}

io.sockets.on('connection', function (socket) {// WebSocket Connection
    var lightvalue = 0; //static variable for current status
    pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
      if (err) { //if an error
        console.error('There was an error', err); //output error message to console
        return;
      }
      lightvalue = value;
      socket.emit('light', lightvalue); //send button status to client
    });
    socket.on('light', function(data) { //get light switch status from client
      lightvalue = data;
      if (lightvalue != LED.readSync()) { //only change LED if status has changed
        LED.writeSync(lightvalue); //turn LED on or off
      }
    });
  });
  
  process.on('SIGINT', function () { //on ctrl+c
    LED.writeSync(0); // Turn LED off
    LED.unexport(); // Unexport LED GPIO to free resources
    pushButton.unexport(); // Unexport Button GPIO to free resources
    process.exit(); //exit completely
  });

http.listen(8080); //listen to port 8080 */
app.listen(3000); //listen to port 3000
console.log('Server is running on port 3000...');