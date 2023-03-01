const { Router } = require('express')
const router = Router()
const auth = require('../../middleware/auth.middleware');

router.post('/doctor_procient/doctor/get', auth, (req, res) => {
    require('./doctor_procient').getDocotors(req, res);
})

router.post('/doctor_procient/get', auth, (req, res) => {
    require('./doctor_procient').get(req, res);
})

module.exports = router;