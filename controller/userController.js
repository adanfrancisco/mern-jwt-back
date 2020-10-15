const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')

const registerUser = async (req, res) => {
	try {
		let { email, password, passwordCheck, displayName } = req.body

		// validate
		if (!email || !password || !passwordCheck)
			return res.status(400).json({ msg: 'Not all field have been entered.' })

		if (password.length < 5)
			return res
				.status(400)
				.json({ msg: 'The password needs to be at least 5 characters long.' })

		if (password !== passwordCheck)
			return res.status(400).json({ msg: "Passwords don't match." })

		// verify if exist email in DB
		const existingUser = await User.findOne({ email: email })
		if (existingUser)
			return res
				.status(400)
				.json({ msg: 'An account with this email already exists.' })

		if (!displayName) displayName = email

		// encrypt password
		const salt = await bcrypt.genSalt()
		const passwordHash = await bcrypt.hash(password, salt)

		// add user in DB
		const newUser = new User({
			email,
			password: passwordHash,
			displayName,
		})
		const saveUser = await newUser.save()

		res.json(saveUser)
	} catch (err) {
		res.status(500).json({ err: err.message })
	}
}

const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body

		// validate
		if (!email || !password)
			return res.status(400).json({ msg: 'Not all fields have been entered.' })

		// search user in DB
		const user = await User.findOne({ email: email })

		// validate if user exist
		if (!user)
			return res
				.status(400)
				.json({ msg: 'Not account with this email has been registered.' })

		// compare password with hashPassword
		const isMatch = await bcrypt.compare(password, user.password)

		// validate match password
		if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' })

		// generate token
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

		res.json({
			token,
			user: {
				id: user._id,
				displayName: user.displayName,
			},
		})
	} catch (err) {
		res.status(500).json({ err: err.message })
	}
}

const deleteUser = async (req, res) => {
	try {
		const deletedUser = await User.findByIdAndDelete(req.user)
		res.json(deletedUser)
	} catch (err) {
		res.status(500).json({ err: err.message })
	}
}

const tokenValid = async (req, res) => {
	try {
		// verify token in request
		const token = req.header('x-auth-token')
		if (!token) return res.json(false)

		// verify validate token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		if (!verified) return res.json(false)

		// exist user
		const user = await User.findById(verified.id)
		if (!user) return res.json(false)

		return res.json(true)
	} catch (err) {
		res.status(500).json({ err: err.message })
	}
}

const getUser = async (req, res) => {
	const user = await User.findById(req.user)
	res.json({
		displayName: user.displayName,
		id: user._id,
	})
}

module.exports = { registerUser, loginUser, deleteUser, tokenValid, getUser }
