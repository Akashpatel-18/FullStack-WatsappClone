const { getMessage, createMessage } = require('../controllers/message')

const {isAuthenticated} = require('../middleware/auth')
const router = require('express').Router()

router.post('/message/:token', isAuthenticated, createMessage)

router.get('/message/:token/:sender/:recepient', isAuthenticated, getMessage)

module.exports = router