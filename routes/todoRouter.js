const router = require('express').Router()
const auth = require('../middleware/auth')

const {
	createTodo,
	getAllTodo,
	deleteTodo,
} = require('../controller/todoController')

router.post('/', auth, createTodo)

router.get('/all', auth, getAllTodo)

router.delete('/:id', auth, deleteTodo)

module.exports = router
