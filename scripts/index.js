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
            // orrysean switch from .substr to .includes() method because ES6!!! and also better search functionality also limted number of results to 10
            if (arr[y][2].toUpperCase().includes(val.toUpperCase()) && $(`.autocomplete-item`).length < 10 ) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.setAttribute("class", "autocomplete-item");
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
    $(`.card-back${cardNumber} .image-container`).append(`<img src="https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${playerID}.png" alt="" onerror="this.onerror=null;this.src='https://stats.nba.com/media/img/league/nba-headshot-fallback.png';" class="fadeIn animated">`);
    $(`.card-back${cardNumber}`).addClass(`rotate-card${cardNumber}`);
	$(`.card-back${cardNumber}`).addClass(`rotate-card`);
	$(`.card-back${cardNumber} .image-container`).append(`<div class="horizontal-bar fadeIn animated"></div>`);
	$(`.card-back${cardNumber}`).append(`<div class="card-piping fadeIn animated"></div>`);
};


nba.updateCardInfo = function(infoArray, cardNumber) {
    // Changing Name
    $(`.card-back${cardNumber} .name`).text(infoArray[3]);
    // Height
    $(`.card-back${cardNumber} .height`).text(`Height: ${infoArray[10]}`);
    // Number
    $(`.card-back${cardNumber} .number`).text(`Number: ${infoArray[13]}`);
    // Team Name
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
    $(`.card-back${cardNumber} .team`).text(`Career Stats`);
};

nba.updateTeamLogo = function(playerInfo, cardNumber) {
	$(`.card-back${cardNumber} .image-container`).append(`<div class="logo-container logo${cardNumber} animated fadeIn${cardNumber}"><img src="https://stats.nba.com/media/img/teams/logos/${playerInfo[18]}_logo.svg" class="logo" alt="" onerror="this.onerror=null;this.src='';"></div>`)
}

nba.updateCardColor = function(playerInfo, cardNumber) {
	teamColors = {
		ATL: ["225, 68, 52", "196, 214, 0"],
		BKN: ["0, 0, 0", "255, 255, 255"],
		BOS: ["0, 122, 51", "139, 111, 78"],
		CHA: ["29, 17, 96", "0, 120, 140"],
		CHI: ["206, 17, 65", "6, 35, 34"],
		CLE: ["111, 38, 61", "4, 30, 66"],
		DAL: ["0, 83, 188", "0, 43, 92"],
		DEN: ["0, 45, 98", "81, 145, 205"],
		DET: ["237, 23, 76", "0, 107, 182"],
		GSW: ["0, 107, 182", "253, 185, 39"],
		HOU: ["206 17 65", "6, 25, 34"],
		IND: ["0, 45, 98", "23, 187, 48"],
		LAC: ["237, 23, 76", "0, 107, 182"],
		LAL: ["85, 37, 130", "253, 185, 39"],
		MEM: ["97, 137, 185", "0, 40, 94"],
		MIA: ["152, 0, 46", "249, 160, 27"],
		MIL: ["0, 71, 27", "240, 235, 210"],
		MIN: ["12, 35, 64", "35, 97, 146"],
		NOP: ["0, 22, 65", "225, 58, 62"],
		NYK: ["0, 107, 182", "245, 132, 38"],
		OKC: ["0, 122, 193", "239, 59, 36"],
		ORL: ["0, 125, 297", "6, 25, 34"],
		PHI: ["0, 107, 82", "237, 23, 76"],
		PHX: ["29, 17, 96", "229, 95, 32"],
		POR: ["224, 58, 62", "6, 25, 34"],
		SAC: ["91, 43, 130", "99, 113, 122"],
		SAS: ["196, 206, 211", "6, 25, 34"],
		TOR: ["206, 17, 65", "6, 25, 34"],
		UTA: ["0, 43, 92", "249, 160, 27"],
		WAS: ["0, 43, 92", "227, 24, 55"],
		SEA: ["0, 101, 58", "255, 194, 32"],
    };
    
    if (teamColors[playerInfo[18]] === "" || teamColors[playerInfo[18]] === undefined) {
        $(`.card-back${cardNumber}`).css("border-color", `#fff`);
        $(`.card-back${cardNumber}`).css("outline-color", `#fff`);
        $(`.card-back${cardNumber} .image-container .horizontal-bar`).css("background-color", `#fff`);
        $(`.card-back${cardNumber} .card-piping`).css("border-color", `#000`);
    } else {
        $(`.card-back${cardNumber}`).css("border-color", `rgb(${teamColors[playerInfo[18]][0]})`);
        $(`.card-back${cardNumber}`).css("outline-color", `rgb(${teamColors[playerInfo[18]][0]})`);
        $(`.card-back${cardNumber} .image-container .horizontal-bar`).css("background-color", `rgb(${teamColors[playerInfo[18]][0]})`);
        $(`.card-back${cardNumber} .card-piping`).css("border-color", `rgb(${teamColors[playerInfo[18]][1]})`);
    }
	// card-back after element secondary colour	console.log(teamColors);
};

nba.updateSlider = function (playerStats, cardNumber) {
    $(`.card-back${cardNumber} .slider`).attr("max", playerStats.resultSets[0].rowSet.length);
    $(`.card-back${cardNumber} .slider`).val("0");
};

// Main source of stuff happening for submit click
nba.mainAction = function (playerName1, playerName2, playerOneID, playerTwoID, playerOneInfo, playerTwoInfo, playerOneStats, playerTwoStats, players) {
    nba.updateCardInfo(playerOneInfo,1);
    nba.updateCardInfo(playerTwoInfo, 2);
    nba.updateCardBackImage(playerOneID, 1);
	nba.updateCardBackImage(playerTwoID, 2);
	nba.updateCardStats(playerOneStats, 1);
	nba.updateCardStats(playerTwoStats, 2);
	nba.updateTeamLogo(playerOneInfo, 1);
	nba.updateTeamLogo(playerTwoInfo, 2);
	nba.updateCardColor(playerOneInfo, 1);
    nba.updateCardColor(playerTwoInfo, 2);
    nba.updateSlider(playerOneStats, 1);
    nba.updateSlider(playerTwoStats, 2);
};

nba.updateSliderStats = function (playerStats, cardNumber) {
    sliderValue = $(`.card-back${cardNumber} .slider`).val() - 1;
    stats = playerStats.resultSets[0].rowSet[sliderValue];
    console.log(playerStats.resultSets[0]);
    if (sliderValue < 0) {
        nba.updateCardStats(playerStats, cardNumber);
    } else {
        $(`.card-back${cardNumber} .points p`).text(stats[26]);
        $(`.card-back${cardNumber} .assists p`).text(stats[21]);
        $(`.card-back${cardNumber} .steals p`).text(stats[22]);
        $(`.card-back${cardNumber} .rebounds p`).text(stats[20]);
        $(`.card-back${cardNumber} .blocks p`).text(stats[23]);
        $(`.card-back${cardNumber} .fg p`).text(`${Math.round(stats[11] * 1000) / 10}%`);
        $(`.card-back${cardNumber} .3pt p`).text(`${Math.round(stats[14] * 1000) / 10}%`);
        $(`.card-back${cardNumber} .gp p`).text(stats[6]);
        $(`.card-back${cardNumber} .team`).text(`${stats[1]} ${stats[4]}`);
    }
};

nba.init = async function() {
    const playerList = await nba.getPlayerList();
    let playerName1;
    let playerName2;
    let playerOneID;
    let playerTwoID;
    let results;
    let playerOneInfo;
    let playerTwoInfo;
    let playerOneStats;
    let playerTwoStats;

	autocomplete(document.getElementById("myInput"), playerList);
    autocomplete(document.getElementById("myInput2"), playerList);
    
	$('#compare').on('click', async function (e) {
        e.preventDefault(); 
        if (document.getElementById("myInput").value === "" || document.getElementById("myInput2") === "") {
            alert('Please choose two names.');
        } else {
            $('#ballWrapper').css("display", "none");
            $('.wrapper').css("justify-content", "flex-start");
            $('.card-back').css("display", "none");
            $('.vs').css("display", "none");
            playerName1 = $("#myInput").val();
            playerName2 = $("#myInput2").val();
            playerOneID = nba.getPlayerID(playerName1, playerList);
            playerTwoID = nba.getPlayerID(playerName2, playerList);
            results = await Promise.all([nba.getPlayerInfo(playerOneID), nba.getPlayerInfo(playerTwoID), nba.getPlayerStats(playerOneID), nba.getPlayerStats(playerTwoID)])
            .catch(function () {
                // dispatch a failure and throw error
                alert('Player not found! Try again.');
            });
            playerOneInfo = results[0];
            playerTwoInfo = results[1];
            playerOneStats = results[2];
            playerTwoStats = results[3];
            nba.mainAction(playerName1, playerName2, playerOneID, playerTwoID, playerOneInfo, playerTwoInfo, playerOneStats, playerTwoStats, playerList);
            $('.vs').css("display", "block");
            $('.card-back').css("display", "block");
        }
    });
    
    $('.slider').on('mousemove change', async function (e) {
        nba.updateSliderStats(playerOneStats, 1);
        nba.updateSliderStats(playerTwoStats, 2);
    });

};

// Document Ready
$(function(){
    nba.init();
});




