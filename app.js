var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()
const simulationRouter = require('./routes/router')
const uiaSimulationRouter = require('./routes/uiarouter')
//Database connector
mongoose.connect('mongodb://localhost/spacesuit')
app.use('/api/simulation', simulationRouter)
app.use('/api/simulation/', uiaSimulationRouter)


//EJS framework for website display
app.use(bodyParser.json())
app.use((req,res,next) =>{
	res.setHeader(
		'Access-Control-Allow-Origin', '*'
	)
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-Width, Content-Type, Accept'
	)
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PATCH, DELETE, OPTIONS'
	)
	next()
})
app.set('port', (process.env.PORT || 3000))
app.set('view engine', 'ejs') 
app.use('/assets', express.static('assets'))
app.listen(app.get('port'), function(){
	console.log('Node app is running on port', app.get('port'))
}) //listen to port 3000
