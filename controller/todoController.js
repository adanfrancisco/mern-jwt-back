const Todo = require('../models/todoModel')

const createTodo = async (req, res) => {
	try {
		const { title } = req.body

		//validation
		if (!title)
			return res.status(400).json({ msg: 'Not all fields have been entered' })

		const newTodo = new Todo({
			title,
			userId: req.user,
		})

		const saveTodo = await newTodo.save()
		res.json(saveTodo)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

const getAllTodo = async (req, res) => {
	const todos = await Todo.find({ userId: req.user })

	res.json(todos)
}

const deleteTodo = async (req, res) => {
	const { id } = req.params
	const todo = await Todo.findOne({ userId: req.user, _id: id })

	if (!todo)
		return res.status(400).json({
			msg: 'No todo found with this ID that belongs to the current user.',
		})

	const deletedTodo = await Todo.findByIdAndDelete(id)

	res.json(deletedTodo)
}

module.exports = {
	createTodo,
	getAllTodo,
	deleteTodo,
}
