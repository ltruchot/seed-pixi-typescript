// node dependencies
import * as path from 'path'; // helper to manage path of folder/files
import * as http from 'http'; // helper for manager servers
import * as compression from 'compression'; // helper to serve correctly gzipped website in production

// npm dependencies
import * as express from 'express'; // a server
import * as bodyParser from 'body-parser'; // a parser for incoming request bodies
import * as morgan from 'morgan'; // a logger for REST API
import * as SocketIOStatic from 'socket.io';

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
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

// Get port from environment and store in Express.
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

/*** removable example of socket.io use, @see client/app.ts ***/
const io = SocketIOStatic(server);
let userCounter = 0;
io.on('connection', (socket: any) => {
	io.emit('active-users-counter', ++userCounter);
	socket.on('disconnect', () => {
		io.emit('active-users-counter', --userCounter);
	})
});
/**************************************************************/

// Listen on provided port, on all network interfaces.
server.listen(port, () => console.log(`API running on localhost:${port}`));
