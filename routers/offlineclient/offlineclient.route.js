const { Router } = require('express')
const router = Router()
const auth = require('../../middleware/auth.middleware')

router.post('/client/register', auth, (req, res) => {
    require('./clients.route').register(req, res)
})

router.post('/client/add', auth, (req, res) => {
    require('./clients.route').add(req, res)
})

router.post('/client/connector/add', auth, (req, res) => {
    require('./clients.route').addConnector(req, res);
})

router.post('/client/getall', auth, (req, res) => {
    require('./clients.route').getAll(req, res)
})

router.post('/client/getallreseption', auth, (req, res) => {
    require('./clients.route').getAllReseption(req, res)
})

router.put('/client/update', auth, (req, res) => {
    require('./clients.route').update(req, res)
})

router.put('/client/end', auth, (req, res) => {
    require('./clients.route').end(req, res)
})

router.post('/client/counter_doctors/get', auth, (req, res) => {
    require('./clients.route').getCounterDoctors(req, res);
})

router.post('/client/turns/get', auth, (req, res) => {
    require('./clients.route').getTurns(req, res);
})

router.post('/client/registeronline', auth, (req, res) => {
    require('./clients.route').registerOnline(req, res);
})

router.post('/client/next_step', auth, (req, res) => {
    require('./clients.route').nextToStep(req, res)
})

router.post('/client/next_step/access', auth, (req, res) => {
    require('./clients.route').accessNextStep(req, res)
})

// AfterClient

router.post("/client/after_client/register", auth, (req, res) => {
    require("./clients.route").registerAfter(req, res)
})

router.post("/client/after_client/get", auth, (req, res) => {
    require("./clients.route").getAfterClients(req, res)
})

module.exports = router
