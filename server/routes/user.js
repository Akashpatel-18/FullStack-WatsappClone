const router = require('express').Router()
const {signUp,login} = require('../controllers/user')

router.post('/signUp', signUp)
router.post('/login', login)


module.exports = router