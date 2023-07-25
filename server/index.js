const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 3000
const fs = require('fs');
const readline = require('readline');
const nameList = fs.createReadStream('names.txt');
const puppeteer = require("puppeteer");

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors({
    origin: '*'
}));

//************************************* API ****************************************************
app.get('/', (req, res) => {
	const alph = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let firstChar = alph[Math.floor(Math.random() * 25)];
	let name = randomName(firstChar);
	return res.json(name);
})

app.post('/post', (req, res) => {
	let data = req.body;
	let playerName = data.name;
	let currentName = data.current;
	let currentLastName = getLastName(currentName);

	let firstChar = playerName[0];
	let arr = nameMap[firstChar];

	if(firstChar != currentLastName[0])
	{
		return res.json({state: "lose", reason: "First letter not the same as the last letter!"});
	}

	else if(!arr.includes(playerName))
	{
		return res.json({state: "lose", reason: "Player does not exist!"});
	}

	let lastName = getLastName(playerName);
	firstChar = lastName[0];
	return res.json({name : randomName(firstChar), state: "playing"});
})
//****************************************************************************************************

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const rl = readline.createInterface({
	input: nameList,
	crlfDelay: Infinity
});

var nameMap = {};
rl.on('line', (line) => {
	if(line.includes(' '))
	{
		let firstChar = line[0];
		nameMap[firstChar] = nameMap[firstChar] || [];
		nameMap[firstChar].push(line);
	}
});

rl.on('close', () => {
	console.log('Finished reading the file.');
	//console.log(nameMap);
});

//************************* HELPER FUNCTIONS ****************************************************************
function randomName(firstChar)
{
 	let arr = nameMap[firstChar];
 	let name = arr[Math.floor(Math.random() * arr.length)];
	return name;
}

function getLastName(name)
{
	let spaceIndex = name.indexOf(' ');
	return name.substr(spaceIndex + 1);
}
