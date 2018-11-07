var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()
const simulationRouter = require('./routes/router')
//Database connector
mongoose.connect('mongodb://localhost/spacesuit')
app.use('/api/simulation', simulationRouter)

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
app.set('view engine', 'ejs') 
app.use('/assets', express.static('assets'))
app.listen(3000) //listen to port 3000
console.log('Server is running on port 3000...')