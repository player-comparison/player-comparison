function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    let currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        let a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", `${this.id}autocomplete-list`);
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        

        // orrysean wrote this
        // converting this forloop into a while loop for better speed
        // this website shows us that while loops are faster than for loops for some array operations
        // https://jsperf.com/new-array-vs-splice-vs-slice/31
        // https://jsperf.com/fastest-array-loops-in-javascript/57
        
        let x = arr.length;
        
        while ( x-- ) {
        let y = arr.length - x;     
         
        /*for each item in the array...*/
            /*check if the item starts with the same letters as the text field value:*/
            // orrysean switch from .substr to .includes() method because ES6!!! and also better search functionality
            if (arr[y][2].toUpperCase().includes(val.toUpperCase()) ) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                
                // orrysean converted this into ES6 template literal. Ryan said leave it ugly. 
                b.innerHTML = `<strong>${arr[y][2].substr(0, val.length)}${arr[y][2].substr(val.length)}<input type='hidden' value="${arr[y][2]}"></strong> `;

                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
                
            }
        }
    });

    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(`${this.id}autocomplete-list`);
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            // e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
		} 
		// else if (e.keyCode == 9) {
		// 	if ($("#myInput").focus()) {
		// 	}
		// 	else if ($("#myInput2").focus()) {
		// 	}
		// }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
} 

//////////////// END OF AUTO COMPLETE


const nba = {};

// getPlayerList includes player names and player ID
nba.getPlayerList = function() {
    return $.ajax({
        url: 'http://stats.nba.com/stats/commonallplayers/?IsOnlyCurrentSeason=0&LeagueID=00&Season=2017-18',
        dataType: 'jsonp',
        method: 'GET'
    })
    .then((results) => {
        return results.resultSets[0].rowSet;
    });
};


// Associate Player Name with PlayerID and return the ID
nba.getPlayerID = function (playerName, players) {
	let i = players.length;
	while (i--) {
		if (playerName === players[i][2]) {
			return players[i][0];
		}
	}
};

// this function gives an array with the basic player information, not including statistics
nba.getPlayerInfo = function (playerID) {
	return $.ajax({
		url: `http://stats.nba.com/stats/commonplayerinfo/?PlayerID=${playerID}`,
		dataType: 'jsonp',
		method: 'GET'
	})
    .then((results) => {
        return results.resultSets[0].rowSet[0];
    });
};

nba.getPlayerStats = function(playerID) {
    return $.ajax({
        url: `http://stats.nba.com/stats/playercareerstats/?PerMode=PerGame&playerID=${playerID}`,
        dataType: 'jsonp',
        method: 'GET'
    })
    .then((results) => {
        return results;
    });
}

nba.updateCardBackImage = function(playerID, cardNumber) {
    $(`.card-back${cardNumber} .image-container`).empty();
    $(`.card-back${cardNumber} .image-container`).append(`<img src="https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${playerID}.png" alt="" onerror="this.onerror=null;this.src='https://stats.nba.com/media/img/league/nba-headshot-fallback.png';">`);
    $(`.card-back${cardNumber}`).addClass(`rotate-card${cardNumber}`);
    $(`.card-back${cardNumber}`).addClass(`rotate-card`);
	
};


nba.updateCardInfo = function(infoArray, cardNumber) {
    // Changing Name
    $(`.card-back${cardNumber} .name`).text(infoArray[3]);
    // Height
    $(`.card-back${cardNumber} .height`).text(`Height: ${infoArray[10]}`);
    // Number
    $(`.card-back${cardNumber} .number`).text(`Number: ${infoArray[13]}`);
    // Team Name
    $(`.card-back${cardNumber} .team`).text(`${infoArray[20]} ${infoArray[17]}`);
}

nba.updateCardStats = function(playerStats, cardNumber) {
	// 0	"PLAYER_ID"
	// 1	"LEAGUE_ID"
	// 2	"Team_ID"
	// 3	"GP"
	// 4	"GS"
	// 5	"MIN"
	// 6	"FGM"
	// 7	"FGA"
	// 8	"FG_PCT"
	// 9	"FG3M"
	// 10	"FG3A"
	// 11	"FG3_PCT"
	// 12	"FTM"
	// 13	"FTA"
	// 14	"FT_PCT"
	// 15	"OREB"
	// 16	"DREB"
	// 17	"REB"
	// 18	"AST"
	// 19	"STL"
	// 20	"BLK"
	// 21	"TOV"
	// 22	"PF"
	// 23	"PTS"
	careerStats = playerStats.resultSets[1].rowSet[0];
	$(`.card-back${cardNumber} .points p`).text(careerStats[23]);
	$(`.card-back${cardNumber} .assists p`).text(careerStats[18]);
	$(`.card-back${cardNumber} .steals p`).text(careerStats[19]);
	$(`.card-back${cardNumber} .rebounds p`).text(careerStats[17]);
	$(`.card-back${cardNumber} .blocks p`).text(careerStats[20]);
	$(`.card-back${cardNumber} .fg p`).text(`${Math.round(careerStats[8] * 1000)/10}%`);
	$(`.card-back${cardNumber} .3pt p`).text(`${Math.round(careerStats[11] * 1000)/10}%`);
	$(`.card-back${cardNumber} .gp p`).text(careerStats[3]);
};

nba.updateTeamLogo = function(playerInfo, cardNumber) {
	$(`.card-back${cardNumber} .image-container`).append(`<img src="https://stats.nba.com/media/img/teams/logos/${playerInfo[18]}_logo.svg" class="logo logo${cardNumber}" alt="" onerror="this.onerror=null;this.src='';">`)
}


// Main source of stuff happening for submit click
nba.mainAction = async function (playerName1, playerName2, players) {
    // Variables with Player IDS
    let playerOneID = nba.getPlayerID(playerName1, players);
	let playerTwoID = nba.getPlayerID(playerName2, players);
	// Variables with Player Information not including Statistics
	let results = await Promise.all([nba.getPlayerInfo(playerOneID), nba.getPlayerInfo(playerTwoID), nba.getPlayerStats(playerOneID), nba.getPlayerStats(playerTwoID)]);
    let playerOneInfo = results[0];
	let playerTwoInfo = results[1];
    // Variables with Player Career Stats
	let playerOneStats = results[2];
	let playerTwoStats = results[3];
    // console.log(playerOneStats, playerTwoStats);
    nba.updateCardInfo(playerOneInfo,1);
    console.log(playerOneInfo)
    nba.updateCardInfo(playerTwoInfo, 2);
    // nba.updateCardStats(playerOneInfo, 1)
    nba.updateCardBackImage(playerOneID, 1);
	nba.updateCardBackImage(playerTwoID, 2);
	console.log(playerOneStats, playerTwoStats);
	nba.updateCardStats(playerOneStats, 1);
	nba.updateCardStats(playerTwoStats, 2);
	nba.updateTeamLogo(playerOneInfo, 1);
	nba.updateTeamLogo(playerTwoInfo, 2);
};

nba.init = async function() {
	const playerList = await nba.getPlayerList();	
	autocomplete(document.getElementById("myInput"), playerList);
	autocomplete(document.getElementById("myInput2"), playerList);

	$('#compare').on('click', function (e) {
			e.preventDefault();	
            nba.mainAction($("#myInput").val(), $("#myInput2").val(), playerList);
	});

};

// Document Ready
$(function(){
    nba.init();
});




