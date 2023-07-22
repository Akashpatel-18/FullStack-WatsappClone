const { createChat, getUsers, getMyUsers, allUsers, myProfile, getUser, searchUsers } = require('../controllers/chat')
const {isAuthenticated} = require('../middleware/auth')
const router = require('express').Router()

router.post('/chats/:token', isAuthenticated, createChat)
router.get('/myProfile/:token', isAuthenticated, myProfile)
router.get('/users', isAuthenticated, allUsers)
router.get('/users/:token/:sender', isAuthenticated, getUsers)
router.get('/users/search/:token/:person/:sender', isAuthenticated, searchUsers)
router.get('/user/:token/:userId', isAuthenticated, getUser)
router.get('/myUsers/:token/:sender', isAuthenticated, getMyUsers)


module.exports = router