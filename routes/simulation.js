const express = require('express')
const bodyParser = require('body-parser')
require('../models/SimulationState')
require('../models/SimulationControl')

const simulation = require('../controllers/simulation')

const router = express.Router()

//Router for simulation
router.use(bodyParser.urlencoded({extended: false}))

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
	await simulation.stop()
	res.sendStatus(204)
})

router.post('/pause', async (req, res) => {
	await simulation.pause()
	res.sendStatus(204)
})

router.post('/unpause', async (req, res) => {
	await simulation.unpause()
	res.sendStatus(204)
})

router.get('/state', async (req, res) => {
	const state = await simulation.getState()
	res.json(state)
})


router.get('/controls', async (req, res) => {
	const controls = await simulation.getControls()
	res.json(controls)
})

//TODO: update python script for correct request 
router.patch('/controls', async (req, res) => {
	const newControls = req.body
	console.log(newControls)
	const state = await simulation.setState(newControls)
	res.json(state)
})


module.exports = router

