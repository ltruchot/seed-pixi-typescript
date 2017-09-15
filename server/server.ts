// node dependencies
import * as path from 'path'; // helper to manage path of folder/files
import * as http from 'http'; // helper for manager servers
import * as compression from 'compression'; // helper to serve correctly gzipped website in production

// npm dependencies
import * as express from 'express'; // a server
import * as bodyParser from 'body-parser'; // a parser for incoming request bodies
import * as morgan from 'morgan'; // a logger for REST API

// local dependencies
// import { environment } from './../config/settings';

// create app
const app = express();

// app config
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Point static path to assets & index
app.use('/public', express.static(path.join(__dirname, 'public')));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

// Get port from environment and store in Express.
const port = process.env.PORT || '5000';
app.set('port', port);


// Create HTTP server.
const server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port, () => console.log(`API running on localhost:${port}`));

// CORS
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
});
