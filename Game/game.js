	window.onload = function()
	{
		startName();
	};

	document.addEventListener('keydown', (event) =>
	{
		let name = event.key;
		if(name == 'Enter')
		{
			submit();
		}

	}, false);

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
			document.getElementById("lose_text").textContent = "Time's Up!";
			
			createLoseButton();
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
		}

		else if(data.state == "lose" && state != "lose")
		{
			state = "lose";
			document.getElementById("lose_text").textContent = data.reason;
			
			createLoseButton();
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
			post(playerName, currentName);
			document.getElementById("player_name").value = "";
		}
	}
