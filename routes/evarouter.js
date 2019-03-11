const express = require('express')
const bodyParser = require('body-parser')
require('../models/SimulationState')
require('../models/SimulationControl')
require('../models/SimulationFailure')
const simulation = require('../simulations/evasimulation')

const router = express.Router()

//Router for simulation
router.use(bodyParser.urlencoded({extended: false}))
router.use(bodyParser.json())
router.use((req,res,next) =>{
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

router.post('/start', async (req, res) => {
	try{
		await simulation.start()
		res.sendStatus(204)
	}
	catch (error){
		console.error('failed to start simulation')
		console.error(error.toString())
		res.sendStatus(500)
	}
})
router.post('/stop', async (req, res) => {
	try{ 
		await simulation.stop()
		res.sendStatus(204)
	}
	catch (error){
		console.error('failed to stop simulation')
		console.error(error.toString())
		res.sendStatus(500)
	}
})
router.post('/pause', async (req, res) => {
	try{ 
		await simulation.pause()
		res.sendStatus(204)
	}
	catch(error){
		console.error('failed to pause simulation')
		console.error(error.toString())
		res.sendStatus(500)
	}
})
router.post('/unpause', async (req, res) => {
	try{ 
		await simulation.unpause()
		res.sendStatus(204)
	}
	catch(error){		
		console.error('failed to unpause simulation')
		console.error(error.toString())
		res.sendStatus(500)
	}
})
router.get('/state', async (req, res) => {
	try{
		const state = await simulation.getState()
		res.json(state)
		//console.log(state)
	}
	catch(error){
		console.error('failed to start get state')
		console.error(error.toString())
		res.sendStatus(500) 
	}
})
router.get('/failure', async (req, res) => {
	try{
		const failure = await simulation.getFailure()
		res.json(failure)
	}
	catch(error){
		console.error('failed to start get failure')
		console.error(error.toString())
		res.sendStatus(500)
	}
})
router.get('/controls', async (req, res) => {
	try{
		const controls = await simulation.getControls()
		res.json(controls)
	}
	catch(error){
		console.error('failed to get controls')
		console.error(error.toString())
		res.sendStatus(500)
	}
})
 
router.patch('/newcontrols', async (req, res) => {
	const newControls = req.query
	console.log(newControls)
	const state = await simulation.setControls(newControls)
	res.json(state)
})

router.patch('/deployerror', async (req, res) => {
	const newFailure = req.query
	console.log(newFailure)
	const state = await simulation.setFailure(newFailure)
	res.json(state)
})


module.exports = router

