const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
	try {
		// get token from header
		const token = req.header('x-auth-token')

		// validate if exist token
		if (!token)
			return res
				.status(401)
				.json({ msg: 'No authentication token, authorization denied.' })

		// verify token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		if (!verified)
			return res
				.status(401)
				.json({ msg: 'Token verification failed, authorization denied.' })

		// send to request to controller
		req.user = verified.id

		next()
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

module.exports = auth
