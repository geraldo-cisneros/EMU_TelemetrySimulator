const express = require('express')
const bodyParser = require('body-parser')
require('../models/SimulationStateUIA')
require('../models/SimulationUIA')

const uiaSimulation = require('../simulations/uiasimulation')

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

router.post('/uiastart', async (req, res) => {
	try{
		await uiaSimulation.uiaStart()
		res.sendStatus(204)
	}
	catch (error){
		console.error('failed to start simulation')
		console.error(error.toString())
		res.sendStatus(500)
	}
})
router.post('/uiastop', async (req, res) => {
	try{ 
		await uiaSimulation.stop()
		res.sendStatus(204)
	}
	catch (error){
		console.error('failed to stop UIA Simulation')
		console.error(error.toString())
		res.sendStatus(500)
	}
})
router.post('/uiapause', async (req, res) => {
	try{ 
		await uiaSimulation.pause()
		res.sendStatus(204)
	}
	catch(error){
		console.error('failed to pause UIA Simulation')
		console.error(error.toString())
		res.sendStatus(500)
	}
})
router.post('/uiaunpause', async (req, res) => {
	try{ 
		await uiaSimulation.unpause()
		res.sendStatus(204)
	}
	catch(error){		
		console.error('failed to unpause UIA Simulation')
		console.error(error.toString())
		res.sendStatus(500)
	}
})
router.get('/uiastate', async (req, res) => {
	try{
		const state = await uiaSimulation.getUIAState()
		res.json(state)
		//console.log(state)
	}
	catch(error){
		console.error('failed to start get state')
		console.error(error.toString())
		res.sendStatus(500)
	}
})

router.get('/uiacontrols', async (req, res) => {
	try{
		const controls = await uiaSimulation.getUIAControls()
		res.json(controls)
	}
	catch(error){
		console.error('failed to get controls')
		console.error(error.toString())
		res.sendStatus(500)
	}
})
 
router.patch('/newuiacontrols', async (req, res) => {
	const newControls = req.query
	console.log(newControls)
	const state = await uiaSimulation.setUIAControls(newControls)
	res.json(state)
})

module.exports = router

