import { connect, connection } from 'mongoose';

const mongoInit = () => {
	const dbOptions = {
		autoIndex: false,
		connectTimeoutMS: 10000,
		family: 4,
	};

	connect('mongodb://localhost:27017/ilmatar', dbOptions);
	//Promise = global.Promise;

	connection.on('connected', () => {
		console.log('Mongoose connection successfully opened!');
	});

	connection.on('err', (err) => {
		console.error(`Mongoose connection error: \n ${err.stack}`);
	});

	connection.on('disconnected', () => {
		console.log('Mongoose connection disconnected');
	});
};

export { mongoInit };
