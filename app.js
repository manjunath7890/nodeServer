const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const expressWs = require('express-ws');
const fetch = require('node-fetch');
const app = express();
expressWs(app);

const bodyParser = require('body-parser');
app.use(cors());

// app.ws('/websocket', (ws, req) => {
//   console.log('WebSocket connected');

//   ws.on('message', (msg) => {
//       console.log(`Received message: ${msg}`);
//       // You can process the received message here or perform actions accordingly
//   });

//   ws.on('close', () => {
//       console.log('WebSocket disconnected');
//   });
// });

const PORT = process.env.PORT || 4000;

dotenv.config({path: './config.env'});

require('./db doc/atlas_conn');
app.use(express.json()); 
app.use(bodyParser.json());

const router = require('./router/router');
app.use(router);

app.listen(PORT, () => {
  console.log('server is running at http://localhost:4000');
});
