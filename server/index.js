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
	let playerName = randomName(firstChar);
	return res.json({name : playerName})
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
	let newName = randomName(firstChar);
	
	return res.json({name : newName, state : "playing"});
})

app.get('/getNameList', (req, res) => {
	return res.json({list : nameArray});
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
var nameArray = [];

rl.on('line', (line) => {
	if(line.includes(' '))
	{
		let firstChar = line[0];
		nameMap[firstChar] = nameMap[firstChar] || [];
		nameMap[firstChar].push(line);
		nameArray.push(line);
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

/*
async function getImageSRC(name)
{
	//(async () => 
	//{
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		await page.goto(`https://www.google.com/search?q=${name}+baseball&hl=EN&tbm=isch&sxsrf=AB5stBj5RTdbpbifdGlk24giTaZBGhxP3g%3A1690251550796&source=hp&biw=1920&bih=995&ei=HjG_ZNS3Le24qtsPzpC4wAE&iflsig=AD69kcEAAAAAZL8_LjVt93KmVapby5cmQQQdHS3tmLun&ved=0ahUKEwjUvo3a5aiAAxVtnGoFHU4IDhgQ4dUDCAY&uact=5&oq=Rafael+Devers&gs_lp=EgNpbWciDVJhZmFlbCBEZXZlcnMyCBAAGIAEGLEDMgsQABiABBixAxiDATIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAESOEeULMIWLMecAF4AJABAJgBaaAB8QaqAQQxMS4xuAEDyAEA-AEBigILZ3dzLXdpei1pbWeoAgrCAgcQIxjqAhgnwgIIEAAYsQMYgwE&sclient=img`);

		//images
		const images = await page.evaluate(() => Array.from(document.images, e => e.src));
		await browser.close();
		
		return images[30];
	//})();
}
*/
