const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 3000
const fs = require('fs');
const readline = require('readline');
const nameList = fs.createReadStream('names.txt');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/post', (req, res) => {
	let data = req.body;
	res.send('Data Received: ' + JSON.stringify(data));
	console.log(data.name);
	console.log(nameSet.has(data.name));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const rl = readline.createInterface({
	input: nameList,
	crlfDelay: Infinity
});

var nameSet = new Set();
rl.on('line', (line) => {
	//console.log(`Line: ${line}`);
	nameSet.add(line);
});

rl.on('close', () => {
	console.log('Finished reading the file.');
	console.log(nameSet);
});
