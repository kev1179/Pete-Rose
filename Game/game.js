function getCookie(name) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
            return cookie.substring(name.length + 1);
        }
    }
    return "";
}

	window.onload = function()
	{
		startName();
		const currentBackground = getCookie("bg");
		let fileName = "url('./Images/bg" + currentBackground + ".jpg')";
		let styleElem = document.head.appendChild(document.createElement("style"));
		styleElem.innerHTML = ".bg:before {background-image: " + fileName + ";}";
	};

	document.addEventListener('keydown', (event) =>
	{
		let name = event.key;
		if(name == 'Enter' && state != "lose")
		{
			submit();
		}

		else if(name == 'Enter' && state == "lose")
		{
			loseDiv.classList.remove("show");
			resetGame();
		}

	}, false);

	const button = document.getElementById("enter");
	button.addEventListener("click", function() 
	{
		submit();
	});

	//SOURCE: https://www.geeksforgeeks.org/how-to-create-popup-box-using-html-and-css/
	const closeLoseBox = document.getElementById("closeLoseBox");
	closeLoseBox.addEventListener("click", function()
	{
		loseDiv.classList.remove("show");
		resetGame();
	});

	async function startName()
	{
		let response = await fetch("http://localhost:3000/");
		const data = await response.json();
		document.getElementById("current_player").textContent = data.name;
	}

	async function getNameList()
	{
		let response = await fetch("http://localhost:3000/getNameList");
		const data = await response.json();
		return data.list;
	}

	function changeName(name)
	{
		document.getElementById("current_player").textContent = name;
	}
	
	function updateTimer()
	{
		if(timer > 0 && state != "lose")
		{
			timer--;
			document.getElementById("timer").textContent = timer;
		}

		if(timer == 0 && state != "lose")
		{
			timer -= 1;	
			state = "lose";
			document.getElementById("loseReason").textContent = "Ran out of time!";
			loseDiv.classList.add("show");
		}
	}

	function createLoseButton()
	{

		const startOver = document.createElement("button");
		startOver.innerHTML = "Start Over";
		document.getElementById("gameInfo").appendChild(startOver);
		startOver.id = "start_over";

		document.getElementById("start_over").className = "btn btn-success";

		startOver.addEventListener('click', () =>
		{
			location.reload();
		})
	}

	var score = 0;
	var state = "playing";
	var timer = 10;
	var guesses = new Set();
	let playerStack = []

	setInterval(updateTimer, 1000);

	async function post(playerName, currentName)
	{
		let response = await fetch('http://localhost:3000/post', 
		{
			method: 'POST',
			headers: 
		{
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},

			body: JSON.stringify({name: playerName, current: currentName})
		})

		const data = await response.json();

		if(data.state == "playing" && state == "playing")
		{
			changeName(data.name);
			score++;
			let batSound = new Audio('Sounds/bat_sound.mp3');
			batSound.play();
			document.getElementById("score").textContent = score;
			timer = 10;
			document.getElementById("timer").textContent = "10";

			let namesArea = document.getElementById("namesArea");
			namesArea.innerHTML = "";
			for(let i = playerStack.length - 1; i >= 0; i--)
			{
				let nameElement = document.createElement('p');
				nameElement.style.color = "white";
				nameElement.style.textAlign = "center";
				nameElement.style.fontFamily = "Arial";
				nameElement.style.fontSize = "30px";

				nameElement.textContent = playerStack[i];
				namesArea.appendChild(nameElement);
			}
		}

		else if(data.state == "lose" && state != "lose")
		{
			state = "lose";
			//document.getElementById("lose_text").textContent = data.reason;
			
			loseDiv.classList.add("show");
			document.getElementById("loseReason").textContent = data.reason;
			//createLoseButton();
		}
	}

	async function submit()
	{
		let nameField = document.getElementById("player_name");
		let playerName = nameField.value;
		let currentName = document.getElementById("current_player").textContent;
		
		if(!guesses.has(playerName))
		{
			guesses.add(playerName);
			playerStack.push(playerName);
			post(playerName, currentName);
			document.getElementById("player_name").value = "";
		}
	}

	function resetGame()
	{
		score = 0;
		state = "playing";
		timer = 10;
		guesses = new Set();
		playerStack = [];
		document.getElementById("timer").textContent = "10";
		document.getElementById("score").textContent = "0";
		document.getElementById("namesArea").innerHTML = "";
		startName();
	}
