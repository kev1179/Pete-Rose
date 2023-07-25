	async function startName()
	{
		let response = await fetch("http://localhost:3000/");
		const name = await response.json();
		document.getElementById("current_player").textContent = name;
		//document.getElementById("current_player").textContent = response.text();
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

			const startOver = document.createElement("button");
			startOver.innerHTML = "Start Over";
			document.body.appendChild(startOver);
			startOver.id = "start_over";

			startOver.addEventListener('click', () =>
			{
				location.reload();
			})
		}
	}

	var score = 0;
	var state = "playing";
	var timer = 10;

	setInterval(updateTimer, 1000);

	async function post()
	{
		let nameField = document.getElementById("player_name");
		let playerName = nameField.value;
		let currentName = document.getElementById("current_player").textContent;

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
			document.getElementById("score").textContent = score;
			timer = 10;
		}

		else if(data.state == "lose" && state != "lose")
		{
			state = "lose";
			document.getElementById("lose_text").textContent = data.reason;

			const startOver = document.createElement("button");
			startOver.innerHTML = "Start Over";
			document.body.appendChild(startOver);
			startOver.id = "start_over";

			startOver.addEventListener('click', () =>
			{
				location.reload();
			})
		}

	}
