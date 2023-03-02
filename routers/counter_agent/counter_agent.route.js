const { Router } = require('express')
const router = Router()
const auth = require('../../middleware/auth.middleware');

router.post('/counter_agent/doctor/create', auth, (req, res) => {
    require('./counter_agent').create(req, res);
})

router.post('/counter_agent/doctors_services/get', auth, (req, res) => {
    require('./counter_agent').get(req, res);
})

router.post('/counter_agent/counterdoctorall/get', auth, (req, res) => {
    require('./counter_agent').getDcotors(req, res);
})

router.post('/counter_agent/get', auth, (req, res) => {
    require('./counter_agent').getCounterAgents(req, res);
})

module.exports = router;