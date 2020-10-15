const mongoose = require('mongoose')

const connectDB = async () => {
	try {
		const connection = await mongoose.connect(
			process.env.MONGODB_CONNECTION_STRING,
			{
				useNewUrlParser: true,
				useCreateIndex: true,
				useFindAndModify: false,
				useUnifiedTopology: true,
			}
		)

		console.log(`MongoDB Connected: ${connection.connection.host}`)
	} catch (err) {
		console.log(err.message)
	}
}

module.exports = connectDB
