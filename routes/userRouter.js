const router = require('express').Router()

const auth = require('../middleware/auth')

const {
	registerUser,
	loginUser,
	deleteUser,
	tokenValid,
	getUser,
} = require('../controller/userController')

// register user
router.post('/register', registerUser)

// login
router.post('/login', loginUser)

// delete user
router.delete('/delete', auth, deleteUser)

// valid token
router.post('/tokenIsValid', tokenValid)

// get data uset
router.get('/', auth, getUser)

module.exports = router
