const { Router } = require('express')
const router = Router()

router.post('/bot/send', (req, res) => {
    require('./bot.controller').sendData(req, res)
})

module.exports = router